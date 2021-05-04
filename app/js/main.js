$(function () {

  $('.top-block__choice-slider').slick({
    arrows:false,
    dots:true,
    autoplay:true,
    autoplaySpeed: 9000,
    fade:true,
     responsive: [
    {
      breakpoint: 1200,
      settings: {
        dots: false
      }
    },
  ]
  });


  $('.reviews-content').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows:false,
    dots:true,
  });


$('.menu__btn').on('click', function(){
  $('.menu-list').toggleClass('menu-list_active')
})

})