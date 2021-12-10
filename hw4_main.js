import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

import { Candles } from './hw4_class.js';

var camera, scene, renderer;
var candle0, flameMesh0, light0;
var candlesGroup = [];

function makeCandles(positionX, positionZ) {

	var candle = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 32), new THREE.MeshPhongMaterial({
		color: 0xfa8072,
	}));
	candle.position.set(positionX, 7.5, positionZ);
	return candle;
}

function CandleLight() {

	let loader = new THREE.TextureLoader();    // load a resource
  
	loader.load('https://i.imgur.com/sAQQugh.png',
		function(texture) {
			var texMat = new THREE.MeshBasicMaterial({
				map: texture,
				alphaTest:0.5
			});
			flameMesh0 = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), texMat);
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set (1/3,1/3);
			texture.offset.set (0,2/3);
			//scene.add (flameMesh);
			candle0 = makeCandles(0, 0);
			candle0.add (flameMesh0);
			scene.add (candle0);
			flameMesh0.position.y = 11;
		},
		undefined,
		function(xhr) {
		  console.log('An error happened');
		}
	  );

	light0 = new THREE.PointLight("white", 0.4);
	light0.position.set(0, 20, 0);
	scene.add(light0);
}

function textureAnimate() {

	textureAnimate.count = (textureAnimate.count === undefined) ? 1 : textureAnimate.count;

	if (flameMesh0!== undefined) {
		var texture = flameMesh0.material.map;
		texture.offset.x += 1/3;
		
		if (textureAnimate.count % 3 === 0) {
			texture.offset.y -= 1/3;
		}
		textureAnimate.count++;
	}
}

function init() {
	
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(renderer.domElement);
	let width = window.innerWidth;
	let height = window.innerHeight;
	renderer.setSize(width, height);

	renderer.setClearColor(0xe9967a);

	scene = new THREE.Scene();
	var grid = new THREE.GridHelper(200, 20, 'red', 'white');
	//scene.add(grid);
	var axes = new THREE.AxesHelper(5);
	//scene.add(axes);

	camera = new THREE.PerspectiveCamera(35, width / height, 1, 10000);
	camera.position.set(0, 10, 200);
	camera.position.set(150, 100, 0);
	
	let controls = new OrbitControls(camera, renderer.domElement);
	
	controls.enableKeys = false;

	window.addEventListener('resize', onWindowResize, false);
	////////////////////////////////////////////////////////////////
	let ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhongMaterial({
		color: 0x8b0000
	}));
	ground.rotation.x = -Math.PI / 2;
	
	CandleLight();
	
	var candle1 = new Candles(-40, 40);
	var candle2 = new Candles(-40, 0);
	var candle3 = new Candles(-40, -40);
	var candle4 = new Candles(0, 40);
	var candle5 = new Candles(0, -40);
	candlesGroup.push(candle1, candle2, candle3, candle4, candle5);
	scene.add(ground);
	setInterval(textureAnimate, 70);
}

function onWindowResize() {

	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function update(evt) {	///keyboard.ver///

	if (evt.key == 1) {

		candlesGroup[0].flameOut();
	}
	if (evt.key == 2) {

		candlesGroup[1].flameOut();
	}
	if (evt.key == 3) {

		candlesGroup[2].flameOut();
	}
	if (evt.key == 4) {

		candlesGroup[3].flameOut();
	}
	if (evt.key == 5) {

		flameMesh0.material.visible = false;
		light0.intensity = 0;
		setTimeout(function() {
			flameMesh0.material.visible = true;
			light0.intensity = 0.4;
		}, 2000);
	}
	if (evt.key == 6) {

		candlesGroup[4].flameOut();
	}
}



function animate() {
	
	window.onkeydown = function(evt){
		var evt = window.event?window.event:evt;
		update(evt);
	}
	
	requestAnimationFrame(animate);
	render();
	
	let cameraRoot = camera.position.clone();
    cameraRoot.y = 0;
	if (candle0 !== undefined)
		candle0.lookAt(cameraRoot);
	candlesGroup.forEach(function(t){t.candle.children[0].lookAt(cameraRoot)});
}

function render() {

	renderer.render(scene, camera);
}

export {init, animate, scene};