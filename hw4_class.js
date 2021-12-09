import * as THREE from "https://threejs.org/build/three.module.js";
import {scene} from './hw4_main.js';

class Candles {

	constructor(positionX = 0, positionZ = 0){
	
		this.body = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 15, 32), new THREE.MeshPhongMaterial({
			color: 0xfa8072,
		}));
		this.body.position.set(positionX, 7.5, positionZ);
		
		this.loader = new THREE.TextureLoader();    // load a resource
		this.loader.load('https://i.imgur.com/sAQQugh.png',
			function(texture) {
				
				var flameMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({
					map: texture,
					alphaTest:0.5
				}));
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set (1/3,1/3);
				texture.offset.set (0,2/3);
				scene.add (flameMesh);
				//this.candle = makeCandles(positionX, positionZ);
				//this.body.add(flameMesh);
				//scene.add(this.body);
				flameMesh.position.set(positionX, 18.5, positionZ);
			},
			undefined,
			function(xhr) {
			  console.log('An error happened');
			}
		);
		//this.body.add(flameMesh);
		scene.add(this.body);
		this.light = new THREE.PointLight("white", 0.4);
		this.light.position.set(positionX, 22, positionZ);
		scene.add(this.light);
	}	
	
	textureAnimateClass() {
		console.log("1");
		this.textureAnimateClass.count = (this.textureAnimateClass.count === undefined) ? 1 : this.textureAnimateClass.count;

		if (flameMesh!== undefined) {
			var texture = flameMesh.material.map;
			texture.offset.x += 1/3;
			
			if (this.textureAnimateClass.count % 3 === 0) {
				texture.offset.y -= 1/3;
			}
			this.textureAnimateClass.count++;
		}
	}
}

export {Candles};