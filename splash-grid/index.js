var createCamera = require('orbit-camera')
var createTex2d  = require('gl-texture2d')
var createGeom   = require('gl-geometry')
var createShader = require('gl-shader')
var glslify      = require('glslify')
var createFBO    = require('gl-fbo')

var clear    = require('gl-clear')({ color: [1, 1, 1, 1] })
var mat4     = require('gl-matrix').mat4
var quat     = require('gl-matrix').quat
var triangle = require('a-big-triangle')
var debounce = require('frame-debounce')
var unindex  = require('unindex-mesh')
var normals  = require('face-normals')
var combine  = require('mesh-combine')
var fit      = require('canvas-fit')
var qbqb     = require('cube-cube')
var getTime  = require('right-now')
var clone    = require('clone')

var TIMESCALE = 0.5
var SIZE      = 16
var RES       = [1 / SIZE, 1 / SIZE]

module.exports = function(canvas) {
  canvas.style.position = 'fixed'

  var gl         = require('gl-context')(canvas, render)
  var heightmap  = createFBO(gl, [SIZE, SIZE], { float: true })
  var gradient   = createTex2d(gl, require('./gradient-map'))
  var voxels     = createMesh()
  var projection = mat4.create()
  var viewrot    = mat4.create()
  var view       = mat4.create()
  var model      = mat4.create()
  var camera     = createCamera(
      [0, 10, 30]
    , [0, 0, 0]
    , [0, 1, 0]
  )

  var shader = createShader(gl
    , glslify('./shaders/voxel.vert')
    , glslify('./shaders/voxel.frag')
  )

  var heightShader = createShader(gl
    , glslify('./shaders/heightmap.vert')
    , glslify('./shaders/heightmap.frag')
  )

  var geom = createGeom(gl)
    .attr('aPosition', voxels.positions)
    .attr('aCentroid', voxels.centroids)
    .attr('aNormal', voxels.normals)
    .attr('aEdge', voxels.edges)

  camera.distance = 1.5

  heightmap.color[0].wrap = gl.CLAMP_TO_EDGE
  heightmap.color[0].minFilter = gl.NEAREST
  heightmap.color[0].maxFilter = gl.NEAREST
  mat4.translate(model, model, [-0.5, 0, -0.5])

  window.addEventListener('resize'
    , debounce(fit(canvas, window))
    , false
  )

  function render() {
    var width  = canvas.width
    var height = canvas.height

    var now    = getTime() * TIMESCALE

    heightmap.bind()
    gl.viewport(0, 0, SIZE, SIZE)
    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)

    heightShader.bind()
    heightShader.uniforms.uTime = now
    heightShader.uniforms.uResolution = RES

    triangle(gl)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, width, height)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)

    clear(gl)

    mat4.perspective(projection
      , Math.PI / 4
      , width / height
      , 0.001
      , 100
    )

    quat.identity(camera.rotation)
    quat.rotateY(camera.rotation, camera.rotation, now * 0.0002)
    quat.rotateX(camera.rotation, camera.rotation, -0.5)
    camera.view(view)

    quat.identity(camera.rotation)
    quat.rotateY(camera.rotation, camera.rotation, now * 0.0002)

    geom.bind(shader)
    shader.uniforms.uResolution = RES
    shader.uniforms.uViewRotation = mat4.fromQuat(viewrot, camera.rotation)
    shader.uniforms.uProjection = projection
    shader.uniforms.uModel = model
    shader.uniforms.uView = view
    shader.uniforms.tHeightmap = heightmap.color[0].bind(0)
    shader.uniforms.tGradient  = gradient.bind(1)

    geom.draw()
    geom.unbind()
  }
}

function createMesh() {
  var voxels    = qbqb(SIZE, 1, SIZE)
  var positions = unindex(combine(voxels))
  var edges     = unindex(combine(getEdges(voxels)))
  var centroids = unindex(combine(getCentroids(voxels)))

  return {
      positions: positions
    , centroids: centroids
    , normals: normals(positions)
    , edges: edges
  }
}


function getCentroids(meshes) {
  return meshes.map(function(mesh) {
    mesh = clone(mesh)

    for (var i = 0; i < mesh.positions.length; i++) {
      mesh.positions[i] = mesh.centroid
    }

    return mesh
  })
}

function getEdges(meshes) {
  return meshes.map(function(mesh) {
    mesh = clone(mesh)

    var idx = mesh.index

    for (var i = 0; i < mesh.positions.length; i++) {
      var pos = mesh.positions[i]
      mesh.positions[i] = mesh.positions[i].slice()
      mesh.positions[i][0] = (((pos[0] * SIZE) - idx[0]) - 0.5) * 2
      mesh.positions[i][2] = (((pos[2] * SIZE) - idx[2]) - 0.5) * 2
      mesh.positions[i][1] = (((pos[1]) - idx[1]) - 0.5) * 2
    }

    return mesh
  })
}
