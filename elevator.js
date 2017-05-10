export default class Elevator {
  constructor() {
    this.floor = 0, // current floor
    this.motionStatus = 'idle', // idle, up, down
    this.requests = [], // array of people
    this.riders = [],
    this.stops = [0], // array of stops made
    this.totalFloors = 0 // total floors traversed
  }

  get currentFloor() {
    return this.floor
  }

  getStops() {
    return this.stops.length - 1
  }

  calculateTotalFloors() {
    let total = 0

    for(let i = this.stops.length -1; i > 0; i --){
      total = total + Math.abs(this.stops[i] - this.stops[i-1])
    }

    this.totalFloors = total
  }

  addRequest (person) {
    if(person){
      this.requests.push(person)
    }
  }

  addRider(rider) {
    this.motionStatus = rider.direction
    this.riders.push(rider)
  }

  removeRider(rider) {
    this.riders.shift()
    this.motionStatus = 'idle'
  }

  goToFloor (person) {
    person && this.addRequest(person)

    if(this.requests.length) {
      const rider = this.requests[0]
      this.floor = rider.currentFloor
      this.addRider(rider)
      this.stops.push(rider.currentFloor, rider.dropOffFloor)      // this.stops.push(rider.dropOffFloor)
      this.floor = rider.dropOffFloor
      this.removeRider(rider)
      this.requests.shift()
      this.calculateTotalFloors()
    }

    this.requests.length && this.goToFloor()
  }

  reset() {
    this.floor = 0
    this.motionStatus = 'idle', // idle, up, down
    this.requests = [], // array of people
    this.riders = [], // array of current riders
    this.stops = [0], // array of stops made
    this.totalFloors = 0 // total floors traversed
  }
}
