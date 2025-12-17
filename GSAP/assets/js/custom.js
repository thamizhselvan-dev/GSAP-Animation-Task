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
