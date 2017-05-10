class Person {
  constructor({ name, currentFloor, dropOffFloor }) {
    this.name = name,
    this.currentFloor = currentFloor,
    this.dropOffFloor = dropOffFloor,
    this.direction = this.requestDirection()
  }

  requestDirection() {
    return this.currentFloor < this.dropOffFloor? 'up':'down'
  }
}


export default Person
