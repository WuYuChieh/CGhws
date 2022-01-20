import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var scene, renderer, camera;
var pointLight;
var angle = 0;
var sceneRTT, teapot, renderTarget;
var quad, meshs = [];

function init() {
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set (0, 120, 200);

	let controls = new OrbitControls(camera, renderer.domElement);

	var ambientLight = new THREE.AmbientLight(0x555555);
	scene.add(ambientLight);

	window.addEventListener('resize', onWindowResize, false);
	
	var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
    scene.add(gridXZ);
	/////////////////////////////////////////////////////////

	sceneRTT = new THREE.Scene();
	pointLight = new THREE.PointLight(0xffffff);
	pointLight.position.set(0, 300, 200);
	sceneRTT.add(pointLight);

	renderTarget = new THREE.WebGLRenderTarget(
		1024*8, 1024*8, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBFormat
		}
	);

	teapot = new THREE.Mesh(new TeapotGeometry(0.12),
		new THREE.ShaderMaterial({
        uniforms: {
			lightpos: {type: 'v3', value: new THREE.Vector3(0, 500, 300)}
        },
        vertexShader: document.getElementById('myMeshVertexShader').textContent,
        fragmentShader: document.getElementById('myMeshShader').textContent
    }));

	teapot.scale.set(20, 20, 20);
	sceneRTT.add(teapot);

	let plane = new THREE.PlaneBufferGeometry(500, 500);

	let rttmaterial = new THREE.ShaderMaterial({
		uniforms: {
			mytex: {
				type: "t",
				value: renderTarget.texture
			}
		},
		vertexShader: document.getElementById('myVertexShader').textContent,
		fragmentShader: document.getElementById('myFragmentShader').textContent
	});

	for (var i=0; i<10; i++){
		for (var j=0; j<10; j++){
			let mesh = new THREE.Mesh(plane, rttmaterial);
			mesh.position.set(-90 + j * 20, 5, 90 - i * 20);
			meshs.push(mesh);
			scene.add(mesh);
		}
	}
}

function onWindowResize() {
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {

	requestAnimationFrame(animate);
	angle += 0.01;
	teapot.rotation.y = -5.0*angle;
	teapot.material.uniforms.lightpos.value.set(50 * Math.cos(10*angle), 80, 50 * Math.sin(10*angle));
	//pointLight.position.set(50 * Math.cos(angle), 80, 50 * Math.sin(angle));
	
	// render teapot to texture
	renderer.setRenderTarget (renderTarget);
	renderer.setClearColor(0xffff00);
	renderer.render(sceneRTT, camera);

	// render texture to meshs
	renderer.setRenderTarget(null);
	renderer.setClearColor(0x00ced1);
	renderer.render(scene, camera);
	meshs.forEach(function(p){
		p.lookAt(camera.position.x, 0, camera.position.z);
	});
}

export {init, animate, scene};