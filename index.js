/*
TODO
Draw Spider Web:
 find point at certain radius
 draw line connecting two points
Spider onLine() function (returning the line that the spider is on)
Spider rotationMatches() function (test that the line the spider is on is within a couple degrees)
Spider move(int) function move forward or backward
 
*/
 
const center = document.querySelector("center")
const sprite = document.querySelector("sprite")
const edgeConnectors = document.querySelectorAll('toEdges *')
let windowDimensions = {x: window.innerWidth, y: window.innerHeight}
 
 
const topL = edgeConnectors[0]
const topR = edgeConnectors[1]
const bottomL = edgeConnectors[2]
const bottomR = edgeConnectors[3]
 
const randomX = Math.random()/2
const randomY = Math.random()/2
 
class Point {
 constructor(x = null, y = null) {
   if (!x||!y) throw new Error("NotValid")
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
 }
  render() {
   this.domElement.style.left = `${this.origin.x}px`
   this.domElement.style.top = `${this.origin.y-5}px`
   this.domElement.style.width = this.length+20
   this.domElement.style.transform = `rotate(${this.theta}rad)`
 }
 updateCenter() {
 
 }
 updatePoint(coord) {
   
 }
 
 circlePoint(radius) {
 
 }
}
 
let centerCoords = {x: (windowDimensions.x/4 + windowDimensions.x*randomX), y: (windowDimensions.y/4 + windowDimensions.y*randomY)}
 
function renderWeb() {
 let right = windowDimensions.x
 let bottom = windowDimensions.y
 let halfright = right/2
 let halfbottom = bottom/2
 center.style.left= `${centerCoords.x}px`
 center.style.top = `${centerCoords.y}px`
 
 
 let edgeLines = []
 const corners = [{x: right, y: bottom}, {x: 0, y: bottom}, {x: right, y: 0}, {x: 0, y: 0}, {x: 0, y: halfbottom},  {x: right, y: halfbottom},  {x: halfright, y: 0},  {x: halfright, y: bottom}]
 edgeConnectors.forEach((ele, ind) => {
   temp = new Line(null, ele, centerCoords, corners[ind])
   temp.render()
   edgeLines.push(temp)
 })
 }
 
 
 
 
 
 
 
 
 
renderWeb()
 
window.addEventListener('resize', event => {
 windowDimensions = {x: window.innerWidth, y: window.innerHeight}
 centerCoords = {x: (windowDimensions.x/4 + windowDimensions.x*randomX), y: (windowDimensions.y/4 + windowDimensions.y*randomY)}
 renderWeb()
})
 
const followMouse = true
if (followMouse) {
 window.addEventListener('mousemove', event => {
 
     centerCoords = {x: event.clientX, y: event.clientY}
     renderWeb()
 })
}
 
