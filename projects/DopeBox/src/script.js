var yearSelected;
var dopeDetailsOfPosts={};
//This function is used to show the selected song in the dropdown menu 
$('.dropdown-menu a').click(function(){
    $('#selected').text($(this).text());
    yearSelected=$(this).text();
  });

function postDedication() {
  // Add a new message entry to the Firebase Database.
  var postData=getPostDetails();
  // Get a key for a new Post.
  //console.log("Post Dedication invoked");
  //var newPostKey = firebase.database().ref().child('posts').push().key;

  if(postData||false)
  {
    var ref = firebase.database().ref("posts");
    ref.once("value")
    .then(function(snapshot) {

        return firebase.database().ref('posts').push({
            by: postData[0],
            title: postData[1],
            year:postData[2],
            content:postData[3],
            dopes:0,
          }).then(()=>{
            alert("Wuhu! Your dedication was submitted");

          })
        .catch(function(error) {
            alert('Oops! There was an error posting it. We apologize, kindly refresh and try again');
            console.error('Error posting dedication to database', error);
          });
      });
  }
}


function updateCardWithData(ctr){

  var hasDopeDetailsInBrowser=true;
  var storedDopeDetailsOfPosts,numberOfChildren;
  if(!localStorage.hasOwnProperty('dopeDetailsOfPosts'))
  {
     hasDopeDetailsInBrowser=false;
    
  }
  else
  {
    storedDopeDetailsOfPosts=JSON.parse(localStorage.getItem("dopeDetailsOfPosts"));
  }

var query1 = firebase.database().ref("posts");

    var firstPromise=new Promise((resolve,reject)=>{

      query1.once("value",function(snapshot) {

      numberOfChildren = snapshot.numChildren(); 

      if(numberOfChildren!=null)
        resolve();


    }).then(()=>{

    var numberOfPostsLoaded=0;

    var secondPromise=new Promise((resolve,reject)=>{
    query1.on('child_added', function(childSnapshot, prevChildKey) {

    currentPostKey=childSnapshot.key;
    currentPost=childSnapshot.val();
    numberOfPostsLoaded++;

      /*$( ".posts-container" ).prepend( '<div class="row"><div class="col-md-12"><div class="card"><div class="card-header view_card_song"><b>'+currentPost.song+'</b></div><div class="card-body"><div class="row"><div class="col-md-12"><div class="row"><div class="col-md-6 col-12"><h5><b>From</b></h5><h6 class="view_card_dedicated_by">'+currentPost.by+'</h6></div><div class="col-md-6 col-12"><h5><b>To</b></h5><h6 class="view_card_dedicated_to">'+currentPost.to+'</h6></div></div><hr></div></div><div class="row"><div class="col-md-12"><button class="btn btn-primary btn-danger btn-block" id="'+currentPostKey+'" onclick="increaseDope(this.id)"><a class="view_card_dopes" id="child">'+currentPost.dopes+'</a><span style="display:inline-block; width: 1em;"></span>Dopes<span style="display:inline-block; width: 1em;"></span><a class="icon ion-ios-flame" style="color: white; font-size: 1.3em;"></a></button></div></div></div></div></div></div>');*/


      $( ".posts-container" ).prepend( '<div class="row"><div class="col-md-12"><div class="card"><div class="card-header view_card_title"><b>'+currentPost.title+'</b></div><div class="card-body"><div class="row"><div class="col-md-10"><h6 class="view_card_dedicated_by"><b>'+currentPost.by+'</b></h6></div><div class="col-md-2"><h6 class="view_card_dedicated_year"><b>'+currentPost.year+' Year</b></h6></div></div><div class="row"><div class="col-md-12"><h6 class="view_card_dedicated_content">'+currentPost.content+'</h6></div><hr></div><div class="row"><div class="col-md-12"> <button class="btn btn-primary btn-danger btn-block" id="'+currentPostKey+'" onclick="increaseDope(this.id)"><a class="view_card_dopes" id="child">'+currentPost.dopes+'</a><span style="display:inline-block; width: 1em;"></span>Dopes<span style="display:inline-block; width: 1em;"></span> <a class="icon ion-ios-flame" style="color: white; font-size: 1.3em;"></a> </button></div></div></div></div></div></div>');
      dopeDetailsOfPosts[currentPostKey]=0;

      jQuery('.card').addClass("hidden").viewportChecker({
        classToAdd: 'visible animated bounceIn', // Class to add to the elements when they are visible
        offset: 100
       });
      
      if(numberOfPostsLoaded==numberOfChildren) 
        {
          resolve();
        }
        //This if condition is satisfied when a new post is published  by the current user,
        // hence the numberOfPostsLoaded exceeds the numberOfChildren
        else if(numberOfPostsLoaded>numberOfChildren)
        {
          localStorage.setItem('dopeDetailsOfPosts',JSON.stringify(dopeDetailsOfPosts));
        }
    });
  }).then(()=>{

    if(!hasDopeDetailsInBrowser)
    {
      localStorage.setItem('dopeDetailsOfPosts',JSON.stringify(dopeDetailsOfPosts));
    }
    //This if-condition is trigerred if their is difference in the number of posts in the database and browser localStorage
    //Triggers posts removed from database,etc.
    else if(Object.keys(dopeDetailsOfPosts).length!=Object.keys(storedDopeDetailsOfPosts).length)
    {
      //console.log("Now");
      localStorage.setItem('dopeDetailsOfPosts',JSON.stringify(dopeDetailsOfPosts));
    }
  });

  });
  });

}



function getPostDetails(){
  var formatNum=/[0123456789]/;
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  var formatTwo=/^\s+$/;
  var formatThree=/ /;

	try{
		var arr=[];
		arr[0]=document.getElementById("post_card_dedicated_by").value;
		arr[1]=document.getElementById("post_card_dedicated_by_title").value;
		arr[2]=yearSelected;
    arr[3]=document.getElementById("post_card_dedicated_by_content").value;

    if(formatNum.test(arr[0]))
    {
      alert("Birth Certificate mai bhi name mai number hai?");
      return false;
    }
    else if(format.test(arr[0]) || format.test(arr[1]))
    {
      alert("Kripya karke special character hataye!");
      return false;
    }
    else if(arr[0]==null)
    {
      alert("This isn't sayat.me ;) Please give your name");
      return false;
    }
    else if(formatTwo.test(arr[0]))
    {
      alert("Do your friends call you WhiteSpace ?");
      return false;
    }
    else if((!formatThree.test(arr[0])))
    {
      alert("There are several "+arr[0]+". Please give the full name");
      return false;
    }
    else if(arr[2]==null)
    {
      alert("Year mention karlo bhai ! :P");
      return false;
    }
    else if(arr[1].includes("mc") || arr[1].includes("chutiya") || arr[1].includes("madarchod") || arr[1].includes("harami") || arr[1].includes("behenchod") || arr[1].includes("bhosda") || arr[1].includes("chod") || arr[1].includes("lauda") || arr[1].includes("betichod") || arr[1].includes("fucker") || arr[1].includes("dick") || arr[1].includes("asshole") || arr[1].includes("idiot") || arr[1].includes("dick"))
    {
      alert("Kindly avoid using foul language");
      return false;
    }
    else if(arr[3].includes("mc") || arr[3].includes("chutiya") || arr[3].includes("madarchod") || arr[3].includes("harami") || arr[3].includes("behenchod") || arr[3].includes("bhosda") || arr[3].includes("chod") || arr[3].includes("lauda") || arr[3].includes("betichod") || arr[3].includes("fucker") || arr[3].includes("dick") || arr[3].includes("asshole") || arr[3].includes("idiot") || arr[3].includes("dick"))
    {
      alert("Kindly avoid using foul language");
      return false;
    }
    else
    {
		  return arr;
    }
	}
	catch(error){
		alert("There was an error retreiving post details, kindly try again");
    console.log(error);
	}
}



function increaseDope(postId){

  var currentDopes=0;
  var postRef=firebase.database().ref("posts/"+postId);
  var storedDopeDetailsOfPosts=JSON.parse(localStorage.getItem('dopeDetailsOfPosts'));
  var dopesGivenPreviously=0;
  //console.log(storedDopeDetailsOfPosts);

  dopesGivenPreviously=storedDopeDetailsOfPosts[postId];
  //console.log(dopesGivenPreviously);
  //console.log(postId);
  if(dopesGivenPreviously<=4)
  {
    postRef.transaction(function(post) {
    
      if (post != null) 
      {
          post.dopes++;
          currentDopes=post.dopes;
          return post;
      }
      else {
          // Return a value that is totally different 
          // from what is saved on the server at this address:
          // This is done because firebase usually returns null value on first call using transaction, 
          // so upon returning 0, it fires-back the call and the transaction is completed
          return 0;
      }
    }, function(error, committed, snapshot) {
      if (error) 
      {
        console.log('Transaction to increase Dope failed!', error);
        alert("Sorry! We could't dope it further, please try again");
      } 
      else if(!committed) {
        console.log('Transaction not completed');
      }
      else
      {
        console.log("Dope successfully incremented");
        document.getElementById(postId).childNodes[0].innerHTML=currentDopes;
        storedDopeDetailsOfPosts[postId]+=1;

        localStorage.setItem('dopeDetailsOfPosts',JSON.stringify(storedDopeDetailsOfPosts));
      }
    });
  }
  else
  {
    alert("Oops! Maximum 5 dopes can be given for a single post");
  }
}


//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
//This is for changing colour in the background

var colors = new Array(
  [62,35,255],
  [60,255,60],
  [255,35,98],
  [45,175,230],
  [255,0,255],
  [255,128,0]);

var step = 0;
//color table indices for: 
// current color left
// next color left
// current color right
// next color right
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.002;

function updateGradient()
{
  
  if ( $===undefined ) return;
  
var c0_0 = colors[colorIndices[0]];
var c0_1 = colors[colorIndices[1]];
var c1_0 = colors[colorIndices[2]];
var c1_1 = colors[colorIndices[3]];

var istep = 1 - step;
var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
var color1 = "rgb("+r1+","+g1+","+b1+")";

var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
var color2 = "rgb("+r2+","+g2+","+b2+")";

 $('#gradient').css({
   background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
    background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});
  
  step += gradientSpeed;
  if ( step >= 1 )
  {
    step %= 1;
    colorIndices[0] = colorIndices[1];
    colorIndices[2] = colorIndices[3];
    
    //pick two new target color indices
    //do not pick the same as the current one
    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
    
  }
}

//----------------------------------------------------------------------------------------------------------
//This is for the particle JS

particlesJS("particle-js",{
  "particles": {
    "number": {
      "value": 81,
      "density": {
        "enable": true,
        "value_area": 710.2440872179734
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "star",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 4
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.3282828282828284,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 33.27645051194538,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 8.41750841750842,
      "direction": "top",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});
setInterval(updateGradient,10);


