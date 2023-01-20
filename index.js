/*
TODO
Spider onLine() function (returning the line that the spider is on)
Spider rotationMatches() function (test that the line the spider is on is within a couple degrees)
Spider move(int) function move forward or backward
 
*/

const sprite = document.querySelector("sprite")
const toEdge = document.querySelector('toEdges')
const connectEC = document.querySelector("edgeConnect")
const web = document.querySelector('web')
let allLines = []
let windowDimensions = {x: window.innerWidth, y: window.innerHeight}
 
 
 
const randomX = Math.random()/2
const randomY = Math.random()/2
 
class Web {
  constructor() {
    
  }
}
 
class Point {
 constructor(x = null, y = null) {
   if (x===null&&y===null) throw new Error("NotValid")
   this.x = x
   this.y = y
 }
}
 
class Line {
 constructor(domParent = false, domElement = false, origin = false, point = false, theta = false, length = false) {
   if (!domParent&&!domElement) throw new Error("NoDOM")
   if (domElement) {
     this.domElement = domElement
     this.domParent = domElement.parentElement
   }
   else {
     this.domParent = domParent
     this.domElement = document.createElement("div")
     this.domElement.classList.add("line")
     this.domParent.appendChild(this.domElement)
    
   }
   if (origin&&point) {
     this.origin = origin
     this.point = point
     this.x = point.x-origin.x
     this.y = point.y-origin.y
     this.length = Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2))
     this.sin = this.y/this.length
     this.cos = this.x/this.length
     this.tan = this.y/this.x
     let cosTheta = Math.acos(this.cos)
     this.theta = this.sin<0?-cosTheta:cosTheta
   }
   else if (origin&&theta&&length) {
     this.origin = origin
     this.theta = theta
     this.length = length
     this.cos = Math.cos(theta)
     this.sin = Math.sin(theta)
     this.tan = Math.tan(theta)
     this.x = this.cos*length
     this.y = this.sin*length
     this.point = {x:this.x+origin.x, y:this.y+origin.y}
   }
   else if (point&&theta&&length) {
     this.point = point
     this.theta = theta
     this.length = length
     this.cos = Math.cos(theta)
     this.sin = Math.sin(theta)
     this.tan = Math.tan(theta)
     this.x = length*this.cos
     this.y = length*this.sin
     this.origin = {x:point.x-this.x, y:point.y-this.y}
   }
   else throw new Error("NotEnoughInfo")
   this.b = origin.y-origin.x*this.tan
   allLines.push(this)
 }
  render() {
   this.domElement.style.left = `${this.origin.x}px`
   this.domElement.style.top = `${this.origin.y-5}px`
   this.domElement.style.width = this.length
   this.domElement.style.transform = `rotate(${this.theta}rad)`
 }
 updateCenter(coord) {
  this.origin = coord
  this.x = this.point.x-this.origin.x
  this.y = this.point.y-this.origin.y
  this.length = Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2))
  this.sin = this.y/this.length
  this.cos = this.x/this.length
  this.tan = this.y/this.x
  let cosTheta = Math.acos(this.cos)
  this.theta = this.sin<0?-cosTheta:cosTheta
  this.render()
  this.b = this.origin.y-this.origin.x*this.tan
  console.log(this.b)
 }
 updatePoint(coord) {
  this.point = coord
  this.x = this.point.x-this.origin.x
  this.y = this.point.y-this.origin.y
  this.length = Math.sqrt(Math.pow(this.x, 2)+Math.pow(this.y, 2))
  this.sin = this.y/this.length
  this.cos = this.x/this.length
  this.tan = this.y/this.x
  let cosTheta = Math.acos(this.cos)
  this.theta = this.sin<0?-cosTheta:cosTheta
  this.render()
  this.b = this.origin.y-this.origin.x*this.tan

 }
 
 circlePoint(radius) {
    let x = this.origin.x + radius * this.cos
    let y = this.origin.y + radius * this.sin
    return new Point(x, y)
 }
 matchLine(point) {
    let r = this.origin.x/this.cos

    let yBounds = this.origin.y>this.point.y?{upper:this.origin.y, lower:this.point.y}:{upper:this.point.y, lower:this.origin.y}
    let xBounds = this.origin.x>this.point.x?{upper:this.origin.x, lower:this.point.x}:{upper:this.point.x, lower:this.origin.x}

    let a = this.tan
    let b = 1
    let c = r * this.sin
    let distanceToLine = Math.abs(a*point.x+b*point.y+c)/Math.sqrt(Math.pow(a,2)+Math.pow(b,2))
    if (
      distanceToLine<100 &&
      point.x < xBounds.upper && point.x > xBounds.lower &&
      point.y < yBounds.upper && point.y > yBounds.lower

    ) return true
    else return false
 }
}




class Circle {
  constructor(radius) {
    this.radius = radius
    let connectionLines = []
    edgeLines.forEach((ele, ind) => {
      let secondLine = ind===edgeLines.length-1?0:ind+1
      let temp = new Line(connectEC, false, edgeLines[ind].circlePoint(radius), edgeLines[secondLine].circlePoint(radius))
      temp.render()
      connectionLines.push(temp)
    })
    this.lines = connectionLines
  }

 updateCircle() {
  this.lines.forEach((ele, ind) => {
    let secondLine = ind===edgeLines.length-1?0:ind+1
    ele.updateCenter(edgeLines[ind].circlePoint(this.radius))
    ele.updatePoint(edgeLines[secondLine].circlePoint(this.radius))
  })
 }
}
 
class Spider {
  constructor(domElement, position) {
    this.position = position
    this.domElement = domElement
    this.theta = 0
    this.center = new Point(position.x-50, position.y-50)
  }
  render() {
   this.domElement.style.left = `${this.center.x}px`
   this.domElement.style.top = `${this.center.y}px`
   this.domElement.style.transform = `rotate(${this.theta}rad)`
  }
  onLine() {
    for (const line in allLines) {

      if (allLines[line].matchLine(this.center)) return true
      else continue
    } return false 
  }
  updateCenter(point) {
    let newX = point.x - 50
    let newY = point.y - 50
    this.center = new Point(newX, newY)
    this.render()
  }
} 
 
let defaultCenter = {x: (windowDimensions.x/4 + windowDimensions.x*randomX), y: (windowDimensions.y/4 + windowDimensions.y*randomY)}
let centerLine = new Line(web, false, new Point(0,0), defaultCenter)

let right = windowDimensions.x
let bottom = windowDimensions.y
let thirdright = right/3
let halfbottom = bottom/2
let edgeLines = []

const edgeConnections = [
  {x: right, y: bottom},
  {x: right, y: halfbottom},
  {x: right, y: 0},
  {x: thirdright*2, y: 0},
  {x: thirdright, y: 0},
  {x: 0, y: 0},
  {x: 0, y: halfbottom},
  {x: 0, y: bottom},
  {x: thirdright, y: bottom},
  {x: thirdright*2, y: bottom}
]
edgeConnections.forEach((ele, ind) => {
  temp = new Line(toEdge, null, defaultCenter, ele)
  temp.render()
  edgeLines.push(temp)
})
const screenLength = Math.sqrt(Math.pow(right, 2) + Math.pow(bottom, 2))
const halfScreen = screenLength/2
const numberOfCircles = Math.floor(Math.random()*4+2)
let allCircles = []
for (let i=1; i<numberOfCircles+1; i++) {
  let temp = new Circle(halfScreen*i/(numberOfCircles+1))
  allCircles.push(temp)
}
let test = new Spider(sprite, defaultCenter)
test.render()







function renderWeb(centerCoords = defaultCenter) {
 
 
 edgeLines.forEach((ele, ind) => {
   ele.updateCenter(centerCoords)
   ele.render()
})
allCircles.forEach(ele => ele.updateCircle())

}
 
window.addEventListener('resize', event => {
 windowDimensions = {x: window.innerWidth, y: window.innerHeight}
 centerCoords = {x: (windowDimensions.x/4 + windowDimensions.x*randomX), y: (windowDimensions.y/4 + windowDimensions.y*randomY)}
 renderWeb()
})
 
let followMouse = false

window.addEventListener('mousemove', event => {
  centerCoords = {x: event.clientX, y: event.clientY}
  if (followMouse) {
     //renderWeb(centerCoords)
    
  }
  test.updateCenter(centerCoords)
  if (test.onLine()) test.domElement.style.backgroundColor = "#00ff00" 
  else test.domElement.style.backgroundColor = "#ff0000"
})
 sprite.textContent = allLines.length

 
/window.addEventListener('mousedown', event => {
  followMouse = !followMouse
  centerCoords = {x: event.clientX, y: event.clientY}
  //renderWeb(centerCoords)
})
