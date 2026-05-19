(function(){
  var canvas = document.getElementById('three-bg');
  if(!canvas) return;
  var wrap = document.body;
  var W = window.innerWidth, H = window.innerHeight;

  var renderer = new THREE.WebGLRenderer({ canvas:canvas, antialias:true, alpha:true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x060608, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 100);
  camera.position.z = 7;

  // SCROLL
  var scroll = 0, targetScroll = 0;
  window.addEventListener('wheel', function(e){
    targetScroll += e.deltaY * 0.0008;
    targetScroll = Math.max(0, Math.min(1, targetScroll));
  }, { passive:true });

  // MOUSE
  var mx = 0, my = 0, smx = 0, smy = 0;
  window.addEventListener('mousemove', function(e){
    mx = (e.clientX/W - 0.5) * 2;
    my = -(e.clientY/H - 0.5) * 2;
  });

  // LEFT — wireframe sphere
  var leftGroup = new THREE.Group();
  scene.add(leftGroup);
  leftGroup.position.set(-4.5, 0, -1);

  var sGeo = new THREE.IcosahedronGeometry(1.4, 3);
  var sEdges = new THREE.EdgesGeometry(sGeo);
  var sLine = new THREE.LineSegments(sEdges, new THREE.LineBasicMaterial({ color:0xc8ff00, transparent:true, opacity:0.18 }));
  leftGroup.add(sLine);

  var dotGeo = new THREE.SphereGeometry(0.035, 8, 8);
  leftGroup.add(new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color:0xc8ff00 })));

  // RIGHT — wireframe box
  var rightGroup = new THREE.Group();
  scene.add(rightGroup);
  rightGroup.position.set(4.5, 0, -1);

  var bGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
  var bEdges = new THREE.EdgesGeometry(bGeo);
  var bLine = new THREE.LineSegments(bEdges, new THREE.LineBasicMaterial({ color:0xffffff, transparent:true, opacity:0.08 }));
  rightGroup.add(bLine);

  var b2Geo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
  var b2Edges = new THREE.EdgesGeometry(b2Geo);
  var b2Line = new THREE.LineSegments(b2Edges, new THREE.LineBasicMaterial({ color:0xc8ff00, transparent:true, opacity:0.14 }));
  rightGroup.add(b2Line);

  // HORIZONTAL LINE
  var hGeo = new THREE.BufferGeometry();
  hGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-10,0,-2, 10,0,-2]), 3));
  var hMat = new THREE.LineBasicMaterial({ color:0xc8ff00, transparent:true, opacity:0.04 });
  scene.add(new THREE.Line(hGeo, hMat));

  // VERTICAL LINES
  for(var i=-5; i<=5; i++){
    if(Math.abs(i)<1) continue;
    var vGeo = new THREE.BufferGeometry();
    vGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([i*1.1,-5,-2, i*1.1,5,-2]), 3));
    var alpha = 0.02 + (1-Math.abs(i)/6)*0.03;
    scene.add(new THREE.Line(vGeo, new THREE.LineBasicMaterial({ color:0x888899, transparent:true, opacity:alpha })));
  }

  // CROSSHAIR CENTER
  var c1g = new THREE.BufferGeometry();
  c1g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.12,0,0, 0.12,0,0]), 3));
  scene.add(new THREE.Line(c1g, new THREE.LineBasicMaterial({ color:0xc8ff00, transparent:true, opacity:0.5 })));
  var c2g = new THREE.BufferGeometry();
  c2g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,-0.12,0, 0,0.12,0]), 3));
  scene.add(new THREE.Line(c2g, new THREE.LineBasicMaterial({ color:0xc8ff00, transparent:true, opacity:0.5 })));

  // FLOATING RINGS
  var rings = [];
  [[-4.5,2.5,-2],[4.5,-2,-3],[-3,-3,-2],[3.5,3,-2],[0,3.5,-3]].forEach(function(p,i){
    var rGeo = new THREE.TorusGeometry(0.28+i*0.06, 0.01, 4, 40);
    var rMat = new THREE.MeshBasicMaterial({ color:i%2===0?0xc8ff00:0x888899, transparent:true, opacity:0.07 });
    var r = new THREE.Mesh(rGeo, rMat);
    r.position.set(p[0],p[1],p[2]);
    r.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    scene.add(r);
    rings.push(r);
  });

  // SMALL PARTICLES
  var pGeo = new THREE.BufferGeometry();
  var pCount = 400;
  var pPos = new Float32Array(pCount*3);
  var pCol = new Float32Array(pCount*3);
  for(var j=0;j<pCount;j++){
    pPos[j*3]   = (Math.random()-0.5)*18;
    pPos[j*3+1] = (Math.random()-0.5)*14;
    pPos[j*3+2] = (Math.random()-0.5)*6 - 2;
    var acc = Math.random()>0.8;
    pCol[j*3]   = acc?0.78:0.12+Math.random()*0.15;
    pCol[j*3+1] = acc?1.0 :0.12+Math.random()*0.15;
    pCol[j*3+2] = acc?0.0 :0.18+Math.random()*0.15;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos,3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol,3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ vertexColors:true, size:0.05, transparent:true, opacity:0.5, depthWrite:false })));

  // ANIMATE
  var t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.005;
    scroll += (targetScroll - scroll) * 0.05;
    smx += (mx - smx) * 0.04;
    smy += (my - smy) * 0.04;

    // LEFT — grows on scroll
    var ls = 0.5 + scroll * 1.1;
    leftGroup.scale.set(ls, ls, ls);
    leftGroup.rotation.y = t*0.15 + smx*0.4;
    leftGroup.rotation.x = t*0.07 + smy*0.25;
    leftGroup.position.y = Math.sin(t*0.5)*0.12;
    sLine.material.opacity = 0.12 + scroll*0.28;

    // RIGHT — shrinks on scroll
    var rs = Math.max(0.1, 1.1 - scroll*0.85);
    rightGroup.scale.set(rs, rs, rs);
    rightGroup.rotation.y = -t*0.18 + smx*0.35;
    rightGroup.rotation.x = t*0.09 - smy*0.22;
    rightGroup.rotation.z = t*0.04;
    rightGroup.position.y = Math.sin(t*0.4+1)*0.12;
    bLine.material.opacity  = 0.14 - scroll*0.08;
    b2Line.material.opacity = 0.08 + scroll*0.18;

    // Camera
    camera.position.x += (smx*0.3 - camera.position.x)*0.04;
    camera.position.y += (smy*0.22 - camera.position.y)*0.04;
    camera.lookAt(scene.position);

    // Rings
    rings.forEach(function(r,i){
      r.rotation.z += 0.003*(i%2===0?1:-1);
      r.rotation.x += 0.002;
      r.material.opacity = 0.04 + Math.sin(t+i)*0.025 + scroll*0.04;
    });

    hMat.opacity = 0.03 + Math.sin(t*1.2)*0.015 + scroll*0.06;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function(){
    W=window.innerWidth; H=window.innerHeight;
    camera.aspect=W/H;
    camera.updateProjectionMatrix();
    renderer.setSize(W,H);
  });
})();
