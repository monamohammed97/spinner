var padding = {
  top: 20,
  right: 40,
  bottom: 0,
  left: 0,
};
var modalSound = document.getElementById("modalSound");
var isModalOpen = false;
var screenWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;
var screenHeight =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;
var isSmallScreen = screenWidth <= 575;
var isMediumScreen = screenWidth <= 991;

if (isSmallScreen) {
  w = 300 - padding.left - padding.right;
} else if (isMediumScreen) {
  w = 400 - padding.left - padding.right;
} else {
  w = 500 - padding.left - padding.right;
}
var h = w;
var r = Math.min(w, h) / 2;
var rotation = 0;
var oldrotation = 0;
var picked = 100000;
var oldpick = [];
var data = [
  {
    label: "😍عيديتك قهوة اليوم علينا",
    color: "#68032B",
  },
  {
    label: "😎ماتشا علينا ",
    color: "#684754",
  },
  {
    label: "😂شكلك كبرت على العيدية",
    color: "#7F3356",
  },
  {
    label: "عيديتك خصم 10 % على الأدوات ",
    color: "#730B3A",
  },
  {
    label: "عيديتك خصم 10 % على الربع كيلو",
    color: "#351723",
  },
  {
    label: "عيديتك خصم 15% على حافظة القهوة",
    color: "#5B112F",
  },
  {
    label: "عيديتك خصك 20% على البروشات",
    color: "#660A34",
  },
  {
    label: "😘حظ أوفر",
    color: "#682D44",
  },
  {
    label: "😆عيديتك مويه",
    color: "#7F3356",
  },
  {
    label: "😉كل عام وأنت بخير",
    color: "#351723",
  },
  {
    label: "عيديتك ربع كيلو بإختيارك 😎 ( بإستثناء المحصول الفاخر )",
    color: "#5B112F",
  },
  {
    label: "شدة أكواب ورقية بإختيارك",
    color: "#660A34",
  },
];

var modifiedData = data.map(function (item) {
  return {
    label: item.label.substring(0, 20),
    color: item.color,
  };
});

var svg = d3
  .select("#chart")
  .append("svg")
  .data([modifiedData])
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom);

var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );

var vis = container.append("g");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });

var arc = d3.svg.arc().outerRadius(r);

var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return modifiedData[i].color;
  })
  .attr("d", function (d) {
    return arc(d);
  });

// add the text
arcs
  .append("text")
  .attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return (
      "rotate(" +
      ((d.angle * 180) / Math.PI - 90) +
      ")translate(" +
      (d.outerRadius - 15) +
      ")"
    );
  })
  .attr("text-anchor", "end")
  .text(function (d, i) {
    return modifiedData[i].label;
  });

document.getElementById("clickSpin").addEventListener("click", spin);

function spin(d) {
  container.on("click", null);

  if (oldpick.length === modifiedData.length) {
    resetWheel();
  }

  var ps = 360 / modifiedData.length,
    pieslice = Math.round(1440 / modifiedData.length),
    rng = Math.floor(Math.random() * 1440 + 360);

  rotation = Math.round(rng / ps) * ps;

  picked = Math.round(modifiedData.length - (rotation % 360) / ps);
  picked =
    picked >= modifiedData.length ? picked % modifiedData.length : picked;
  if (oldpick.indexOf(picked) !== -1) {
    d3.select(this).call(spin);
    return;
  } else {
    oldpick.push(picked);
  }

  rotation += 90 - Math.round(ps / 2);

  vis
    .transition()
    .duration(3000)
    .attrTween("transform", rotTween)
    .each("end", function () {
      oldrotation = rotation;

      // Display result in a modal
      var resultText = document.getElementById("resultText");
      resultText.innerHTML = data[picked].label;
      var modal = document.getElementById("resultModal");
      modal.style.display = "flex";
      modalSound.play();
      startFireworks();
    });
}

//make arrow
svg
  .append("g")
  .attr(
    "transform",
    "translate(" +
      (w + padding.left + padding.right) +
      "," +
      (h / 2 + padding.top) +
      ")"
  )
  .append("path")
  .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z");

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}

function resetWheel() {
  oldpick = [];
}
var closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", function () {
  var modal = document.getElementById("resultModal");
  modal.style.display = "none";
  isModalOpen = false;
  modalSound.pause();
  modalSound.currentTime = 0;
  stopFireworks();
});

window.addEventListener("click", function (event) {
  var modal = document.getElementById("resultModal");
  if (event.target == modal) {
    modal.style.display = "none";
    isModalOpen = false;
    modalSound.pause();
    modalSound.currentTime = 0;
    stopFireworks();
  }
});

var rnd = Math.random,
  flr = Math.floor;

let canvas = document.createElement("canvas");
document.getElementsByTagName("body")[0].appendChild(canvas);
canvas.style.position = "absolute";
canvas.style.width = "100%";
canvas.style.height = "100%";

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let ctx = canvas.getContext("2d");

function rndNum(num) {
  return rnd() * num + 1;
}

function vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function (vec2) {
    this.x = this.x + vec2.x;
    this.y = this.y + vec2.y;
  };
}

function particle(pos, vel) {
  this.pos = new vector(pos.x, pos.y);
  this.vel = vel;
  this.dead = false;
  this.start = 0;

  this.update = function (time) {
    let timeSpan = time - this.start;

    if (timeSpan > 550) {
      this.dead = true;
    }

    if (!this.dead) {
      this.pos.add(this.vel);
      this.vel.y = this.vel.y + gravity;
    }
  };

  this.draw = function () {
    if (!this.dead) {
      drawDot(this.pos.x, this.pos.y, 1);
    }
  };
}

function firework(x, y) {
  this.pos = new vector(x, y);
  this.vel = new vector(0, -rndNum(10) - 3);
  this.color = "hsl(" + rndNum(360) + ", 100%, 50%)";
  this.size = 4;
  this.dead = false;
  this.start = 0;
  let exParticles = [],
    exPLen = 100;

  let rootShow = true;

  this.update = function (time) {
    if (this.dead) {
      return;
    }

    rootShow = this.vel.y < 0;

    if (rootShow) {
      this.pos.add(this.vel);
      this.vel.y = this.vel.y + gravity;
    } else {
      if (exParticles.length === 0) {
        flash = true;
        for (let i = 0; i < exPLen; i++) {
          exParticles.push(
            new particle(this.pos, new vector(-rndNum(10) + 5, -rndNum(10) + 5))
          );
          exParticles[exParticles.length - 1].start = time;
        }
      }
      let numOfDead = 0;
      for (let i = 0; i < exPLen; i++) {
        let p = exParticles[i];
        p.update(time);
        if (p.dead) {
          numOfDead++;
        }
      }

      if (numOfDead === exPLen) {
        this.dead = true;
      }
    }
  };

  this.draw = function () {
    if (this.dead) {
      return;
    }

    ctx.fillStyle = this.color;
    if (rootShow) {
      drawDot(this.pos.x, this.pos.y, this.size);
    } else {
      for (let i = 0; i < exPLen; i++) {
        let p = exParticles[i];
        p.draw();
      }
    }
  };
}

function drawDot(x, y, size) {
  ctx.beginPath();

  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();

  ctx.closePath();
}

var fireworks = [],
  gravity = 0.2,
  snapTime = 0,
  flash = false;

function init() {
  let numOfFireworks = 40;
  for (let i = 0; i < numOfFireworks; i++) {
    fireworks.push(new firework(rndNum(canvas.width), canvas.height));
  }
}

function update(time) {
  for (let i = 0, len = fireworks.length; i < len; i++) {
    let p = fireworks[i];
    p.update(time);
  }
}

function draw(time) {
  update(time);

  ctx.fillStyle = "#6A2F45";
  if (flash) {
    flash = false;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  let newTime = time - snapTime;
  snapTime = time;

  //ctx.fillText(newTime,10,50);

  ctx.fillStyle = "blue";
  for (let i = 0, len = fireworks.length; i < len; i++) {
    let p = fireworks[i];
    if (p.dead) {
      fireworks[i] = new firework(rndNum(canvas.width), canvas.height);
      p = fireworks[i];
      p.start = time;
    }
    p.draw();
  }

  window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
});

function stopFireworks() {
  fireworks = [];
}
function startFireworks() {
  init();
  draw();
}

function stopAnimation() {
  if (!isModalOpen) return;
  isModalOpen = false;
  stopFireworks();
}
