Chart.defaults.global.legend.display = false;
Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.scale.ticks.beginAtZero = true;
Chart.defaults.global.scaleOverride = true;

// VARIABLE FOR TRAFFIC DATA -------- TO PLUG IN TO ACTUAL CREATION OF CHART
let trafficData = {
  labels: ['16-22', '23-29', '30-5', '6-12', '13-19', '20-26', '27-3', '4-10', '11-17', '18-24', '25-31'],
  datasets: [{
    data: [750, 1250, 1000, 2400, 2000, 1500, 1750, 1250, 1850, 2250, 1500],
    backgroundColor: 'rgb(222, 211, 243, 0.5)',
    borderColor: 'rgb(128, 128, 255)',
    borderWidth: 1,
    pointBackgroundColor: 'rgb(255, 253, 252)',
    pointBorderColor: 'rgb(128, 128, 255, 0.8)',
    pointRadius: 4.5,
    pointBorderWidth: 2,
  }]
};

// VARIABLE FOR TRAFFIC OPTIONS -------- TO PLUG IN TO ACTUAL CREATION OF CHART 
let trafficOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2.5,
  animation: {
    duration: 0
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawTicks: false,
          offsetGridLines: true
        },
        ticks: {
          // beginAtZero: true,
          precision: 0,
          padding: 10
        },
      },
      {                           /* CREATING x-axis LINES TO CLOSE IN OUR CHART BORDER  */
        position: 'top',
        ticks: {
          display: false
        },
        gridLines: {
          display: false,
          drawTicks: false,
          lineWidth: 1
        }
      }                           /* END LINE CREATION  */
    ],                  /* END OF X-AXIS OPTIONS  */
    yAxes: [
      {
        gridLines: {
          drawTicks: false,
          offsetGridLines: true
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          min: 0,
          stepSize: 500
        }
      },
      {                                   /* CREATING y-axis LINES TO CLOSE IN OUR CHART BORDER  */
        position: 'right',
        ticks: {
          display: false
        },
        gridLines: {
          display: false,
          drawTicks: false,
          lineWidth: 1.5
        }
      }                                       /* END LINE CREATION  */
    ]                       /* END OF Y-AXIS OPTIONS  */
  }
};

// CREATING OF TRAFFIC LINE CHART 
let trafficChartArea = document.getElementById('traffic-chart').getContext('2d');
let trafficChart = new Chart(trafficChartArea, {
  // The type of chart we want to create
  type: 'line',
  // The data for our dataset
  data: trafficData,
  // Configuration options go here
  options: trafficOptions
});

//BAR CHART SCRIPTING  

/* THIS SNIPPET IS from js fiddle https://jsfiddle.net/uffo/5oty49r3/6/ */
/* WHO KNEW THAT MAKING THE BARS RADIUS ROUNDED WOULD BE SO COMPLEX!!!! */

Chart.elements.Rectangle.prototype.draw = function () {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;

  // If radius is less than 0 or is large enough to cause drawing errors a max
  //      radius is imposed. If cornerRadius is not defined set it to 0.
  var cornerRadius = this._chart.config.options.cornerRadius;
  var fullCornerRadius = this._chart.config.options.fullCornerRadius;
  var stackedRounded = this._chart.config.options.stackedRounded;
  var typeOfChart = this._chart.config.type;

  if (cornerRadius < 0) {
    cornerRadius = 0;
  }
  if (typeof cornerRadius == 'undefined') {
    cornerRadius = 0;
  }
  if (typeof fullCornerRadius == 'undefined') {
    fullCornerRadius = true;
  }
  if (typeof stackedRounded == 'undefined') {
    stackedRounded = false;
  }

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || 'bottom';
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || 'left';
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
    var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
    var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom]
  ];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ['bottom', 'left', 'top', 'right'];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);


  var nextCornerId, nextCorner, width, height, x, y;
  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    nextCornerId = i + 1;
    if (nextCornerId == 4) {
      nextCornerId = 0
    }

    nextCorner = cornerAt(nextCornerId);

    width = corners[2][0] - corners[1][0];
    height = corners[0][1] - corners[1][1];
    x = corners[1][0];
    y = corners[1][1];

    var radius = cornerRadius;
    // Fix radius being too large
    if (radius > Math.abs(height) / 2) {
      radius = Math.floor(Math.abs(height) / 2);
    }
    if (radius > Math.abs(width) / 2) {
      radius = Math.floor(Math.abs(width) / 2);
    }

    var x_tl, x_tr, y_tl, y_tr, x_bl, x_br, y_bl, y_br;
    if (height < 0) {
      // Negative values in a standard bar chart
      x_tl = x;
      x_tr = x + width;
      y_tl = y + height;
      y_tr = y + height;

      x_bl = x;
      x_br = x + width;
      y_bl = y;
      y_br = y;

      // Draw
      ctx.moveTo(x_bl + radius, y_bl);

      ctx.lineTo(x_br - radius, y_br);

      // bottom right
      ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);


      ctx.lineTo(x_tr, y_tr + radius);

      // top right
      fullCornerRadius ? ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr) : ctx.lineTo(x_tr, y_tr, x_tr - radius, y_tr);


      ctx.lineTo(x_tl + radius, y_tl);

      // top left
      fullCornerRadius ? ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius) : ctx.lineTo(x_tl, y_tl, x_tl, y_tl + radius);


      ctx.lineTo(x_bl, y_bl - radius);

      //  bottom left
      ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);

    } else if (width < 0) {
      // Negative values in a horizontal bar chart
      x_tl = x + width;
      x_tr = x;
      y_tl = y;
      y_tr = y;

      x_bl = x + width;
      x_br = x;
      y_bl = y + height;
      y_br = y + height;

      // Draw
      ctx.moveTo(x_bl + radius, y_bl);

      ctx.lineTo(x_br - radius, y_br);

      //  Bottom right corner
      fullCornerRadius ? ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius) : ctx.lineTo(x_br, y_br, x_br, y_br - radius);

      ctx.lineTo(x_tr, y_tr + radius);

      // top right Corner
      fullCornerRadius ? ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr) : ctx.lineTo(x_tr, y_tr, x_tr - radius, y_tr);

      ctx.lineTo(x_tl + radius, y_tl);

      // top left corner
      ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);

      ctx.lineTo(x_bl, y_bl - radius);

      //  bttom left corner
      ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);

    } else {

      var lastVisible = 0;
      for (var findLast = 0, findLastTo = this._chart.data.datasets.length; findLast < findLastTo; findLast++) {
        if (!this._chart.getDatasetMeta(findLast).hidden) {
          lastVisible = findLast;
        }
      }
      var rounded = this._datasetIndex === lastVisible;

      if (rounded) {
        //Positive Value
        ctx.moveTo(x + radius, y);

        ctx.lineTo(x + width - radius, y);

        // top right
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);


        ctx.lineTo(x + width, y + height - radius);

        // bottom right
        if (fullCornerRadius || typeOfChart == 'horizontalBar')
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        else
          ctx.lineTo(x + width, y + height, x + width - radius, y + height);


        ctx.lineTo(x + radius, y + height);

        // bottom left
        if (fullCornerRadius)
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        else
          ctx.lineTo(x, y + height, x, y + height - radius);


        ctx.lineTo(x, y + radius);

        // top left
        if (fullCornerRadius || typeOfChart == 'bar')
          ctx.quadraticCurveTo(x, y, x + radius, y);
        else
          ctx.lineTo(x, y, x + radius, y);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
      }
    }

  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

/* END JS FIDDLE SNIPPET BAR CHART ROUNDED CORNER HELP  */

//bar chart variables ---------------------

let barData = {
  labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  datasets: [{
    label: 'daily visits',
    data: [75, 90, 150, 100, 200, 175, 115],
    backgroundColor: "#6B6EAA",
    borderColor: 'rgb(128, 128, 255)',
    borderWidth: 0
  }]
};

let barOptions = {
  cornerRadius: 15, /* from the js fiddle snippet */
  fullCornerRadius: false,
  legend: {
    display: false
  },
  title: {
    display: false
  },
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2.5,
  animation: {
    duration: 0
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawTicks: false,
          offsetGridLines: true
        },
        ticks: {
          beginAtZero: true,
          precision: 0,
          padding: 10
        },
      },
      {                           /* CREATING x-axis LINES TO CLOSE IN OUR CHART BORDER  */
        position: 'top',
        ticks: {
          display: false
        },
        gridLines: {
          display: false,
          drawTicks: false,
          lineWidth: 1
        }
      }                           /* END LINE CREATION  */
    ],                  /* END OF X-AXIS OPTIONS  */
    yAxes: [
      {
        stacked: true,
        gridLines: {
          drawTicks: false,
          offsetGridLines: true
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          max: 250,
          min: 0,
          stepSize: 50
        }
      },
      {                                   /* CREATING y-axis LINES TO CLOSE IN OUR CHART BORDER  */
        position: 'right',
        ticks: {
          display: false
        },
        gridLines: {
          display: false,
          drawTicks: false,
          lineWidth: 1.5
        }
      }                                       /* END LINE CREATION  */
    ]                       /* END OF Y-AXIS OPTIONS  */
  }
};

//CREATING BAR CHART

let barChartArea = document.getElementById('bar-chart').getContext('2d');
let barChart = new Chart(barChartArea, {
  // The type of chart we want to create
  type: 'bar',
  // The data for our dataset
  data: barData,
  // Configuration options go here
  options: barOptions
});

//creating doughnut chart

//doughnut chart variables

let doughnutData = {
  datasets: [{
    data: [8, 5, 25],
    backgroundColor: ["#84CA8F", "#637D8E", "#6B6EAA"],
    borderWidth: 0,
    weight: 10
  }],
  labels: [
    'Phones',
    'Tablets',
    'Desktop'
  ]
};

let doughnutOptions = {
  responsive: true,
  legend: {
    display: true,
    position: "right",
    align: 'center',
    fullWidth: true,
    labels: {
      boxWidth: 20,
      padding: 20
    }
  },
  title: {
    display: false
  },
  maintainAspectRatio: false,
  aspectRatio: 2.5,
  animation: {
    duration: 0
  }
};

let doughnutChartArea = document.getElementById('donut-chart').getContext('2d');
let doughnutChart = new Chart(doughnutChartArea, {
  // The type of chart we want to create
  type: 'doughnut',
  // The data for our dataset
  data: doughnutData,
  // Configuration options go here
  options: doughnutOptions
});

/* BELL NOTIFICATION ANIMATION %%%%%%%%%%%%%%%%% */

const bellIcon = document.getElementById("bell"); //grabbing our bell icon to manipulate it
const dot = document.querySelector("g"); //grabbing our circle to add the animation class to it
const removeWobble = () => { //callback function for setTimeout
  const storingWobble = document.querySelector(".notification-dot");
  storingWobble.classList.remove("wobble");
};
bellIcon.addEventListener('mouseover', (e) => {
  if (dot.classList != dot.classList.contains("wobble")) {
    dot.classList.add("wobble");
  }
  setTimeout(removeWobble, 2000);
});

/* ALERT BANNER SCRIPT $%$%$%$%$%$%$%$%$%$  */

const closeAlert = (banner) => { //function that hides the message alert on clicking the x button
  banner.addEventListener('click', (e) => { //creating an click event to listen the x button activity
    const close = e.target;
    if (close.classList.contains("alert-banner-close")) {
      banner.style.display = "none"; //hiding banner div 
    }
  });
};

const alertText = (element, style, text) => { //inserting html with this template literal
  element.innerHTML = ` 
  <div class="${style}">
    <p><strong>Alert:</strong> ${text}</p>
    <p class="alert-banner-close">x</p>
  </div>
  `;
};

const alertBanner = document.getElementById("alert"); //grabbing our div where the banner will go
alertText(alertBanner, "alert-banner", "You have <strong>6</strong> overdue tasks to complete"); 
  closeAlert(alertBanner);

/* MESSAGING SECTION SCRIPT %%%%%%%%%%%%%%%%%%%%%%%%%%%%%% */

const form = document.getElementById("message-form");
const user = document.getElementById("message-search");
const message = document.getElementById("message-field");
const send = document.getElementById("send-button");
const messageAlert = document.getElementById("message-alert");

const messageBackground = (color) => { //color function for the style of alert
  messageAlert.style.backgroundColor = color;
};

  send.addEventListener('click', (e) => {
    if (user.value === "" && message.value === "") {
      messageBackground("#FF6B6B");
      alertText(messageAlert, "alert-banner", "Both search and message fields must be filled out");
      closeAlert(messageAlert);
    } else if (user.value === "") {
      messageBackground("#FF6B6B");
      alertText(messageAlert, "alert-banner", "Please fill out user field before sending");
      closeAlert(messageAlert);
    } else if (message.value === "") {
      messageBackground("#FF6B6B");
      alertText(messageAlert, "alert-banner", "Please fill out message field before sending");
      closeAlert(messageAlert);
    } else {
      messageBackground("#84CA8F");
      alertText(messageAlert, "alert-banner message-success", `Message succesfully sent to: ${user.value}`);
      closeAlert(messageAlert);
      form.reset();
    }
    messageAlert.style.display = '';
  });


























