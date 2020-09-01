var yearSelected;
var dopeDetailsOfPosts = {};
$('.dropdown-menu a').click(function() {
    $('#selected').text($(this).text());
    yearSelected = $(this).text()
});

function postDedication() {
    var postData = getPostDetails();
    if (postData || !1) {
        var ref = firebase.database().ref("posts");
        ref.once("value").then(function(snapshot) {
            return firebase.database().ref('posts').push({
                by: postData[0],
                title: postData[1],
                year: postData[2],
                content: postData[3],
                dopes: 0,
            }).then(() => {
                alert("Wuhu! Your dedication was submitted")
            }).catch(function(error) {
                alert('Oops! There was an error posting it. We apologize, kindly refresh and try again');
                console.error('Error posting dedication to database', error)
            })
        })
    }
}

function updateCardWithData(ctr) {
    var hasDopeDetailsInBrowser = !0;
    var storedDopeDetailsOfPosts, numberOfChildren;
    if (!localStorage.hasOwnProperty('dopeDetailsOfPosts')) {
        hasDopeDetailsInBrowser = !1
    } else {
        storedDopeDetailsOfPosts = JSON.parse(localStorage.getItem("dopeDetailsOfPosts"))
    }
    var query1 = firebase.database().ref("posts");
    var firstPromise = new Promise((resolve, reject) => {
        query1.once("value", function(snapshot) {
            numberOfChildren = snapshot.numChildren();
            if (numberOfChildren != null)
                resolve()
        }).then(() => {
            var numberOfPostsLoaded = 0;
            var secondPromise = new Promise((resolve, reject) => {
                query1.on('child_added', function(childSnapshot, prevChildKey) {
                    currentPostKey = childSnapshot.key;
                    currentPost = childSnapshot.val();
                    numberOfPostsLoaded++;
                    $(".posts-container").prepend('<div class="row"><div class="col-md-12"><div class="card"><div class="card-header view_card_title"><b>' + currentPost.title + '</b></div><div class="card-body"><div class="row"><div class="col-md-10"><h6 class="view_card_dedicated_by"><b>' + currentPost.by + '</b></h6></div><div class="col-md-2"><h6 class="view_card_dedicated_year"><b>' + currentPost.year + ' Year</b></h6></div></div><div class="row"><div class="col-md-12"><h6 class="view_card_dedicated_content">' + currentPost.content + '</h6></div><hr></div><div class="row"><div class="col-md-12"> <button class="btn btn-primary btn-danger btn-block" id="' + currentPostKey + '" onclick="increaseDope(this.id)"><a class="view_card_dopes" id="child">' + currentPost.dopes + '</a><span style="display:inline-block; width: 1em;"></span>Dopes<span style="display:inline-block; width: 1em;"></span> <a class="icon ion-ios-flame" style="color: white; font-size: 1.3em;"></a> </button></div></div></div></div></div></div>');
                    dopeDetailsOfPosts[currentPostKey] = 0;
                    jQuery('.card').addClass("hidden").viewportChecker({
                        classToAdd: 'visible animated bounceIn',
                        offset: 100
                    });
                    if (numberOfPostsLoaded == numberOfChildren) {
                        resolve()
                    } else if (numberOfPostsLoaded > numberOfChildren) {
                        localStorage.setItem('dopeDetailsOfPosts', JSON.stringify(dopeDetailsOfPosts))
                    }
                })
            }).then(() => {
                if (!hasDopeDetailsInBrowser) {
                    localStorage.setItem('dopeDetailsOfPosts', JSON.stringify(dopeDetailsOfPosts))
                } else if (Object.keys(dopeDetailsOfPosts).length != Object.keys(storedDopeDetailsOfPosts).length) {
                    localStorage.setItem('dopeDetailsOfPosts', JSON.stringify(dopeDetailsOfPosts))
                }
            })
        })
    })
}

function getPostDetails() {
    var formatNum = /[0123456789]/;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    var formatTwo = /^\s+$/;
    var formatThree = / /;
    try {
        var arr = [];
        arr[0] = document.getElementById("post_card_dedicated_by").value;
        arr[1] = document.getElementById("post_card_dedicated_by_title").value;
        arr[2] = yearSelected;
        arr[3] = document.getElementById("post_card_dedicated_by_content").value;
        if (formatNum.test(arr[0])) {
            alert("Birth Certificate mai bhi name mai number hai?");
            return !1
        } else if (format.test(arr[0]) || format.test(arr[1])) {
            alert("Kripya karke special character hataye!");
            return !1
        } else if (arr[0] == null) {
            alert("This isn't sayat.me ;) Please give your name");
            return !1
        } else if (formatTwo.test(arr[0])) {
            alert("Do your friends call you WhiteSpace ?");
            return !1
        } else if ((!formatThree.test(arr[0]))) {
            alert("There are several " + arr[0] + ". Please give the full name");
            return !1
        } else if (arr[2] == null) {
            alert("Year mention karlo bhai ! :P");
            return !1
        } else if (arr[1].includes("mc") || arr[1].includes("chutiya") || arr[1].includes("madarchod") || arr[1].includes("harami") || arr[1].includes("behenchod") || arr[1].includes("bhosda") || arr[1].includes("chod") || arr[1].includes("lauda") || arr[1].includes("betichod") || arr[1].includes("fucker") || arr[1].includes("dick") || arr[1].includes("asshole") || arr[1].includes("idiot") || arr[1].includes("dick")) {
            alert("Kindly avoid using foul language");
            return !1
        } else if (arr[3].includes("mc") || arr[3].includes("chutiya") || arr[3].includes("madarchod") || arr[3].includes("harami") || arr[3].includes("behenchod") || arr[3].includes("bhosda") || arr[3].includes("chod") || arr[3].includes("lauda") || arr[3].includes("betichod") || arr[3].includes("fucker") || arr[3].includes("dick") || arr[3].includes("asshole") || arr[3].includes("idiot") || arr[3].includes("dick")) {
            alert("Kindly avoid using foul language");
            return !1
        } else {
            return arr
        }
    } catch (error) {
        alert("There was an error retreiving post details, kindly try again");
        console.log(error)
    }
}

function increaseDope(postId) {
    var currentDopes = 0;
    var postRef = firebase.database().ref("posts/" + postId);
    var storedDopeDetailsOfPosts = JSON.parse(localStorage.getItem('dopeDetailsOfPosts'));
    var dopesGivenPreviously = 0;
    dopesGivenPreviously = storedDopeDetailsOfPosts[postId];
    if (dopesGivenPreviously <= 4) {
        postRef.transaction(function(post) {
            if (post != null) {
                post.dopes++;
                currentDopes = post.dopes;
                return post
            } else {
                return 0
            }
        }, function(error, committed, snapshot) {
            if (error) {
                console.log('Transaction to increase Dope failed!', error);
                alert("Sorry! We could't dope it further, please try again")
            } else if (!committed) {
                console.log('Transaction not completed')
            } else {
                console.log("Dope successfully incremented");
                document.getElementById(postId).childNodes[0].innerHTML = currentDopes;
                storedDopeDetailsOfPosts[postId] += 1;
                localStorage.setItem('dopeDetailsOfPosts', JSON.stringify(storedDopeDetailsOfPosts))
            }
        })
    } else {
        alert("Oops! Maximum 5 dopes can be given for a single post")
    }
}
var colors = new Array([62, 35, 255], [60, 255, 60], [255, 35, 98], [45, 175, 230], [255, 0, 255], [255, 128, 0]);
var step = 0;
var colorIndices = [0, 1, 2, 3];
var gradientSpeed = 0.002;

function updateGradient() {
    if ($ === undefined) return;
    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];
    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";
    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
    $('#gradient').css({
        background: "-webkit-gradient(linear, left top, right top, from(" + color1 + "), to(" + color2 + "))"
    }).css({
        background: "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)"
    });
    step += gradientSpeed;
    if (step >= 1) {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length
    }
}
particlesJS("particle-js", {
    "particles": {
        "number": {
            "value": 81,
            "density": {
                "enable": !0,
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
            "random": !1,
            "anim": {
                "enable": !1,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": !1
            }
        },
        "size": {
            "value": 3,
            "random": !0,
            "anim": {
                "enable": !1,
                "speed": 33.27645051194538,
                "size_min": 0.1,
                "sync": !1
            }
        },
        "line_linked": {
            "enable": !0,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": !0,
            "speed": 8.41750841750842,
            "direction": "top",
            "random": !1,
            "straight": !1,
            "out_mode": "out",
            "bounce": !1,
            "attract": {
                "enable": !1,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": !0,
                "mode": "repulse"
            },
            "onclick": {
                "enable": !0,
                "mode": "repulse"
            },
            "resize": !0
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
    "retina_detect": !0
});
setInterval(updateGradient, 10)