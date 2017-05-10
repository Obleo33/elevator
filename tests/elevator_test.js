require('babel-core/register')({
  ignore: /node_modules\/(?!ProjectB)/
});

let assert = require('chai').assert;
let Person = require ('../Person.js').default;

const Elevator = require('../Elevator').default;

describe('Elevator', function() {
  let elevator = new Elevator();

  afterEach(function() {
    elevator.reset();
  });

  it('should have a reset method', () => {
    elevator.floor = 10
    elevator.motionStatus = 'up'
    elevator.requests = [1,2,3]
    elevator.riders = [1,3,4]
    elevator.stops = [0,2,5]
    elevator.totalFloors = 10

    elevator.reset()

    assert.equal(elevator.floor, 0)
    assert.equal(elevator.motionStatus, 'idle')
    assert.deepEqual(elevator.requests, [])
    assert.deepEqual(elevator.riders, [])
    assert.deepEqual(elevator.stops, [0])
    assert.equal(elevator.totalFloors, 0)
  })

  it('should have an addRider method that adds the rider to the riders array', () => {
    let mockUser = new Person({ name: "Homer", currentFloor: 6, dropOffFloor: 1 })

    assert.deepEqual(elevator.riders, [])
    elevator.addRider(mockUser);
    assert.deepEqual(elevator.riders, [{ name: "Homer", currentFloor: 6, dropOffFloor: 1, direction: 'down'}])
  })

  it('should have an removeRider method that removes the rider to the riders array', () => {
    let mockUser = new Person({ name: "Homer", currentFloor: 6, dropOffFloor: 1 })

    elevator.addRider(mockUser);
    assert.deepEqual(elevator.riders, [{ name: "Homer", currentFloor: 6, dropOffFloor: 1, direction: 'down'}])

    elevator.removeRider()
    assert.deepEqual(elevator.riders, [])
  })

  it('should have a requests method that adds the rider to the request array', () => {
    let mockUser = new Person({ name: "Bob", currentFloor: 2, dropOffFloor: 5 })
    elevator.addRequest(mockUser)

    assert.deepEqual(elevator.requests, [{ name: "Bob", currentFloor: 2, dropOffFloor: 5, direction: 'up' }])
  })

  it('should have a calculateTotalFloors method that calculates the total floors traversed', () =>{
    elevator.stops = [0,5,10]
    elevator.calculateTotalFloors()

    assert.equal(elevator.totalFloors, 10)

    elevator.stops = [0,5,10,0,5]
    elevator.calculateTotalFloors()

    assert.equal(elevator.totalFloors, 25)

    elevator.stops = [0,5,10,0,5,6,2]
    elevator.calculateTotalFloors()

    assert.equal(elevator.totalFloors, 30)
  })

  it('should bring a rider to a floor above their current floor', (done) => {
    let mockUser = new Person({ name: "Bob", currentFloor: 2, dropOffFloor: 5 })
    elevator.goToFloor(mockUser);

    assert.equal(elevator.currentFloor, 5);
    assert.equal(elevator.motionStatus, 'idle');
    assert.deepEqual(elevator.getStops(), 2);
    assert.deepEqual(elevator.stops, [0,2,5]);
    done()
  });

  it('should bring a rider to a floor below their current floor', () => {
    let mockUser = new Person({ name: "Bob", currentFloor: 8, dropOffFloor: 3 })
    elevator.goToFloor(mockUser);

    assert.equal(elevator.currentFloor, 3);
    assert.equal(elevator.motionStatus, 'idle');
    assert.deepEqual(elevator.getStops(), 2 );
    assert.deepEqual(elevator.stops, [0, 8, 3]);
  });

  it('should deliver passengers before picking up passenders going the oposite direction', () => {
    let mockUser = new Person({ name: "Bob", currentFloor: 2, dropOffFloor: 8 })
    let mockUser2 = new Person({ name: "Homer", currentFloor: 6, dropOffFloor: 1 })

    elevator.addRequest(mockUser)
    elevator.addRequest(mockUser2)

    assert.deepEqual(elevator.requests.length, 2)

    elevator.goToFloor()
    assert.equal(elevator.stops.length, 5)
    assert.equal(elevator.totalFloors, 15)
  })

  it('should deliver user1 before picking up user2', () => {
    let mockUser = new Person({ name: "Bob", currentFloor: 2, dropOffFloor: 8 })
    let mockUser2 = new Person({ name: "Homer", currentFloor: 4, dropOffFloor: 6 })

    elevator.addRequest(mockUser)
    elevator.addRequest(mockUser2)

    assert.equal(elevator.requests.length, 2)

    elevator.goToFloor()
    assert.deepEqual(elevator.stops, [0,2,8,4,6])
    assert.equal(elevator.totalFloors, 14)
  })

});
