import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { TeapotGeometry } from "https://threejs.org/examples/jsm/geometries/TeapotGeometry.js";

var scene, renderer, camera;
var pointLight, angle = 0, meshs = [];

function init() {

    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x00ced1);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
	camera.position.set(0, 120, 200);

    let controls = new OrbitControls(camera, renderer.domElement);
	window.addEventListener('resize', onWindowResize, false);
	
    var gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
    scene.add(gridXZ);
	//////////////////////////////////////////////////////////////////////////////////
	
    pointLight = new THREE.PointLight(0xffffff);
    scene.add (pointLight);
    scene.add (new THREE.PointLightHelper(pointLight, 5));

	var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    let meshMaterial = new THREE.ShaderMaterial({
        uniforms: {
			lightpos: {type: 'v3', value: new THREE.Vector3()}
        },
        vertexShader: document.getElementById('myVertexShader').textContent,
        fragmentShader: document.getElementById('myFragmentShader').textContent
    });
	
    var geometry = new TeapotGeometry(5);
   
	for (var i=0; i<10; i++){
		for (var j=0; j<10; j++){
			let mesh = new THREE.Mesh(geometry, meshMaterial);
			mesh.position.set(-90 + j * 20, 5, 90 - i * 20);
			meshs.push(mesh);
			scene.add(mesh);
		}
	}
}

function onWindowResize() {

	let width = window.innerWidth;
	let height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

function animate() {

	angle += 0.01;
    
    pointLight.position.set(50 * Math.cos(angle), 80, 50 * Math.sin(angle));    
    meshs[0].material.uniforms.lightpos.value.copy(pointLight.position);
	
	meshs.forEach(function(m){
		m.rotation.y = 2.0*angle;
	})
    requestAnimationFrame(animate);
    render();
}

function render() {

    renderer.render(scene, camera);
}

export {init, animate, scene};