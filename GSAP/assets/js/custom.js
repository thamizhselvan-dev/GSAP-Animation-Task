console.clear();

gsap.registerPlugin(ScrollTrigger);

const sections = gsap.utils.toArray(".vertical-section");

sections.forEach((section) => {
  const large = section.querySelector(".large-child");
  gsap.to(large, {
    y: () => window.innerHeight - large.clientHeight - 64,
    ease: "none",
    scrollTrigger: {
      trigger: section,
      pin: true,
      start: "top top",
      end: () => "+=1000",
      scrub: 0.5,
      markers: true,
      invalidateOnRefresh: true
    }
  });
});


function playAnimation(shape) {
 // the timeline
  let tl = gsap.timeline();
  tl.from(shape,{
    opacity: 0,
    scale: 0,
    ease: "elastic.out(1,0.3)",
  })
  .to(shape,{
    rotation: "random([-360, 360])",
  }, "<")
  .to(shape,{
    y: "120vh",
    ease: "back.in(.4)",
    duration: 1,
  },0)
  
}

/* --------------------------------

The other stuff...

------------------------------------*/
let flair = gsap.utils.toArray(".flair");
let gap = 100; // if you're nosy though, this number spaces the 'lil shapes out
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);
gsap.defaults({duration: 1})

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;
let cachedMousePos = mousePos;

window.addEventListener("mousemove", (e) => {
  mousePos = {
    x: e.x,
    y: e.y
  };
});

gsap.ticker.add(ImageTrail);

function ImageTrail() {
  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  // keep the previous mouse position for animation
  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.1
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos = mousePos;
  }
}

function animateImage() {
  let wrappedIndex = wrapper(index);

  console.log(index, flair.length);

  let img = flair[wrappedIndex];
  gsap.killTweensOf(img);
  
  gsap.set(img, {
    clearProps: "all",
  });
  

  gsap.set(img, {
    opacity: 1,
    left: mousePos.x,
    top: mousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  playAnimation(img);

  index++;
}


const c = document.querySelector(".main canvas");
const ctx = c.getContext("2d");
let cw = (c.width = window.innerWidth);
let ch = (c.height = window.innerHeight);
let radius = Math.max(cw,ch);
const particles = Array(99);

for (let i = 0; i < particles.length; i++) {
  particles[i] = {
    x: 0,
    y: 0,
    scale: 0, 
    rotate: 0,
    img: new Image()
  }  
  particles[i].img.src = "https://assets.codepen.io/16327/flair-"+(2+i%21)+".png";
}

const tl = gsap.timeline({onUpdate:draw})
  .fromTo(particles, {
    x:(i)=> {
      const angle = (i/particles.length * Math.PI *2)- Math.PI/2
      return Math.cos(angle*10) * radius// * i/particles.length
    },
    y:(i)=> {
      const angle = (i/particles.length * Math.PI *2)- Math.PI/2
      return Math.sin(angle*10) * radius// * i/particles.length
    },
    scale: 1.1,
    rotate: 0
  },{
    duration: 5,
    ease: "sine",
    x: 0,
    y: 0,
    scale: 0,
    rotate: -3,
    stagger:{each:-0.05, repeat:-1}
  }, 0)
  .seek(99)

function draw(){  
  particles.sort( (a,b) => a.scale - b.scale ) // sort by scale to set z-indexing  
  ctx.clearRect(0, 0, cw, ch);
  particles.forEach((p, i) => {
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate( p.rotate );
    ctx.drawImage(
      p.img,
      p.x,
      p.y,
      p.img.width * p.scale,
      p.img.height * p.scale
    );
    ctx.resetTransform();
  });
}

window.addEventListener("resize", () => {
  cw = c.width = innerWidth;
  ch = c.height = innerHeight;
  radius = Math.max(cw,ch);
  tl.invalidate();
});

c.addEventListener('pointerup', ()=>{ 
  gsap.to(tl, { 
    timeScale: tl.isActive() ? 0 : 1 // use timeScale to toggle play / pause
  })
})
