function openNav(x) {
  x.classList.toggle("change");
  let nav  = document.getElementById("mySidenav");
  console.log(nav.style.width);
  if ( nav.style.width == "0px")
       nav.style.width = "300px";	
  else	  
       nav.style.width = "0px";	
}

function attachPage(target,url,cblk) {
  let dest = document.getElementById(target)
  fetch(url).then(function(response) {
    response.text().then(function(text) {     
      dest.innerHTML = text;          
      if (cblk) cblk()                 
    });
  })  
}

var notice = {
  show : function(boardid) {
    let board = document.getElementById(boardid)
    board.style.display = 'block'
    return board.querySelector('article')
  },
  hide : function(boardid) {
    let board = document.getElementById(boardid)
    board.style.display = 'none'
    board.querySelector('article').removeChild(document.getElementById('modalCntn'));    
    return board
  },
  page : function(parent,src) {
    fetch(src).then(function(response) {
      response.text().then(function(text) {
        parent.innerHTML = text
      });
    })
  },
  image : function(parent,src) {
    var elem = document.createElement("img");
    elem.setAttribute("class","modal-content");
    elem.setAttribute("id", "modalCntn");
    elem.setAttribute("src", src);
    parent.appendChild(elem);
  },
  video : function(parent,src) {
    var elem = document.createElement("video");
    elem.setAttribute("class","modal-content");
    elem.setAttribute("id", "modalCntn");
    elem.setAttribute("controls",true);
    elem.setAttribute("autoplay",true);
    elem.setAttribute("loop",true);
    var source = document.createElement("source");
    source.setAttribute("src", src);
    source.setAttribute("type", "video/mp4");
    elem.appendChild(source);
    parent.appendChild(elem);
  },
  iframe : function(parent,src) {
    var elem = document.createElement("iframe");
    elem.setAttribute("class","modal-content");
    elem.setAttribute("id", "modalCntn");    
    elem.setAttribute("src", src);
    elem.setAttribute("frameborder", "0");
    //elem.setAttribute("allowfullscreen", true);
    //elem.setAttribute("width", "100%");
    //elem.setAttribute("height", "80%");
    parent.appendChild(elem);
  }
}

/*********************************************************************************/
/*       Autorization operation                                                  */
/*********************************************************************************/

function sysAutorization(url) {
  let sign = document.getElementById('sign-status')
  if(sign.textContent === 'LogOut') {
     sign.textContent = 'LogIn'
     sign.title = ''     
     return
  }
  let modal = document.getElementById('myModal')
  fetch(url).then(function(response) {
    response.text().then(function(text) {
      modal.querySelector('article').innerHTML = text;
      modal.style.display = 'block'
    });
  })
}

function sysLogUser(opts,url,method,cblk) {
  fetch('/users/'+url, {
    method: method,
    body: JSON.stringify(opts),
    headers: {"Content-Type": "application/json"}
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Request New User Registration :', data);
    if ((data.body.code === 200 || data.body.code === 201) && data.body.status) {
        let sign = document.getElementById('sign-status')
        sign.textContent = 'LogOut'
        sign.title = data.body.status.name+'@'+ data.body.status._id
        document.getElementById('myModal').style.display = 'none'
        if (cblk) cblk(data.body.status) 
    }
  });
}

function signUpSwitch(elem) {
  if( elem.lang === 'signin') {
      elem.lang = 'signup'
      elem.textContent = 'Signin Account'
      document.getElementById('singup').style.display = 'block'
  } else {
      elem.lang = 'signin'
      elem.textContent = 'Signup Account'
      document.getElementById('singup').style.display = 'none'
  }
  document.getElementById('uname').style.display = 'block'
  document.getElementById('pswd').style.display = 'block'
}

function forgotPswdSwitch(elem) {
  if( elem.lang === 'remember') {
    elem.lang = 'forgot'
    elem.textContent = 'Remembered Your Password?'
    document.getElementById('uname').style.display = 'none'
    document.getElementById('pswd').style.display = 'none'
    document.getElementById('singup').style.display = 'block'
  } else {
    elem.lang = 'remember'
    elem.textContent = 'Forgot Your Password?'
    document.getElementById('uname').style.display = 'block'
    document.getElementById('pswd').style.display = 'block'
    document.getElementById('singup').style.display = 'none'
  }  
}

function prepareAutorization(cblk) {
  sysLogUser({
    "name" : document.getElementById('input-username').value,
    "email": document.getElementById('input-email').value,
    "pswd" : document.getElementById('input-password').value
  },document.getElementById('sign-trigger').lang,'post',cblk)
}

/*********************************************************************************/
/*       SlideShow operation                                                     */
/*********************************************************************************/
var homeSlideIndex = 1, ts

function homeSlides(n) {
  showHomeSlides(homeSlideIndex += n);
  clearInterval(ts);
}

function currentSlide(n) {
  showHomeSlides(homeSlideIndex = n);
  clearInterval(ts);
}

function showHomeSlides(n) {
  var i;
  var slides = document.getElementsByClassName("slides");
  if (n > slides.length) {homeSlideIndex = 1}    
  if (n < 1) {homeSlideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  slides[homeSlideIndex-1].style.display = "block";  

  var dots = document.getElementsByClassName("dot");   
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }      
  dots[homeSlideIndex-1].className += " active";
}

function initSlideShow() {
  showHomeSlides(homeSlideIndex);            
  ts = setInterval(function(){ showHomeSlides(homeSlideIndex += 1) },5000)
  let mhome = document.querySelector('main.home')
  //mhome.clientWidth
  //mhome.clientHeight
  let imgs = mhome.querySelectorAll('div.grid-item > img.grid-media')  
  for (let i = 0; i < imgs.length; i++) {
      imgs[i].width  = mhome.clientWidth * 0.25
      imgs[i].height = imgs[i].width / 1.4    
      if(imgs[i].id === "cluster")
         imgs[i].width  = imgs[i].height * 1.9
  }
  
  let ifr = mhome.querySelector('div.grid-item > iframe') 
  ifr.width  = mhome.clientWidth * 0.33
  ifr.height = ifr.width / 1.77
}

function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

/******************************************************/
/* ToopTip  operation                                 */
/******************************************************/
function showTitle(elem) {
  var rect = elem.getBoundingClientRect();
  console.log(rect.top, rect.right, rect.bottom, rect.left);
  var tiptext = document.getElementById("tooltip");
  tiptext.classList.remove("tooltiptexthide");
  tiptext.classList.add("tooltiptextshow");
  tiptext.style.top  = ''+rect.bottom+'px';
  tiptext.style.left = ''+rect.left+'px';
  tiptext.children[0].innerHTML = elem.getAttribute("title");
  elem.setAttribute("title","");
  /*
  var rate = document.getElementById("rate");
  rate.classList.remove("ratehide");
  rate.classList.add("rateshow");
  rate.style.top  = ''+rect.bottom+'px';
  rate.style.left = ''+rect.left+'px';
  */  
}

function hideTitle(elem) {
  var tiptext = document.getElementById("tooltip");
  tiptext.classList.remove("tooltiptextshow");
  tiptext.classList.add("tooltiptexthide");  
  elem.setAttribute("title",tiptext.children[0].innerHTML);
  /*
  var rate = document.getElementById("rate");
  rate.classList.remove("rateshow");
  rate.classList.add("ratehide");
  */  
}

function initToolTips() {
  var i;
  var posters = document.getElementsByClassName("tips")
  for (i = 0; i < posters.length; i++) {
      posters[i].onmouseenter = function() {
      var title = this.getAttribute("title");
      if (title) showTitle(this);
      }
      posters[i].onmouseleave = function() {
      hideTitle(this);
      }
  }
}
