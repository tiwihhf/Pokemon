function battleActivation() {
  // Animation transition to game
  gsap.to('#overlay', {
    opacity:1,
    repeat:3,
    yoyo:true,
    duration:0.5,
    onComplete() {
      gsap.to('#overlay', {
        opacity:1,
        duration:0.5,
        onComplete()
        {
          pokemonBattle();
          document.querySelector('#ui').style.display = 'block';
          gsap.to('#overlay', {
            opacity:0,
            duration:0.1
          });
        }
      })
    }
  })
}