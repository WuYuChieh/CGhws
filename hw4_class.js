import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './hw4_main.js';

class Candles {

	constructor(positionX = 0, positionZ = 0){
		
		this.candle = new THREE.Group();
		var body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 32), new THREE.MeshPhongMaterial({
			color: 0xfa8072,
		}));
		
		let loader = new THREE.TextureLoader();    // load a resource
		loader.load('https://i.imgur.com/sAQQugh.png',
			function(texture) {
				
				var flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({
					map: texture,
					alphaTest:0.5
				}));
				flameMesh.position.set(0, 11.5, 0);
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set (1/3,1/3);
				texture.offset.set (0,2/3);
				//scene.add (flameMesh);
				//this.candle = makeCandles(positionX, positionZ);
				//scene.add(this.body);				
				body.add(flameMesh);
			},
			undefined,
			function(xhr) {
			  console.log('An error happened');
			}
		);
		
		body.position.set(positionX, 7.5, positionZ);
		this.candle.add(body);
		//this.body.add(flameMesh);
		this.light = new THREE.PointLight("white", 0.4);
		this.light.position.set(positionX, 22, positionZ);
		
		scene.add(this.candle, this.light);
		this.interval = setInterval(this.textureAnimateClass.bind(this), 70);
	}	
	
	textureAnimateClass() {
		
		this.count = (this.count === undefined) ? 1 : this.count;
		//console.log(this.candle);
		if (this.candle.children[0].children[0].material.map!== undefined) {
			//console.log("1");
			this.texture = this.candle.children[0].children[0].material.map;
			this.texture.offset.x += 1/3;
			
			if (this.count % 3 === 0) {
				this.texture.offset.y -= 1/3;
			}
			this.count++;
		}
	}
	
	flameOut() {
		
		console.log(this.candle);
		this.light.intensity = 0;
		this.candle.children[0].children[0].material.visible = false;
		setTimeout(this.ignition.bind(this), 2000);
	}
	
	ignition() {
		
		console.log(this.candle);
		this.candle.children[0].children[0].material.visible = true;
		this.light.intensity = 0.4;
	}
}

export {Candles};