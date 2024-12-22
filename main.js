
(function () {
    //clear the input field on load.
    document.getElementById('adjMatInp').value = ""
})();


var cy = cytoscape({
    container: document.getElementById('cy'),
    layout: {
        name: 'cose'
    },
    "elements": [
        { "data": { "id": "a" } },
        { "data": { "id": "b" } },
        { "data": { "id": "c" } },
        { "data": { "id": "d" } },
        { "data": { "id": "e" } },
        { "data": { "id": "f" } },
        { "data": { "id": "1", "source": "a", "target": "d", "weight": 1 } },
        { "data": { "id": "2", "source": "b", "target": "e", "weight": 2 } },
        { "data": { "id": "3", "source": "c", "target": "f", "weight": 1 } },
        { "data": { "id": "4", "source": "a", "target": "b", "weight": 1 } },
        { "data": { "id": "5", "source": "b", "target": "c", "weight": 2 } },
        { "data": { "id": "6", "source": "c", "target": "d", "weight": 1 } },
        { "data": { "id": "7", "source": "d", "target": "e", "weight": 1 } },
        { "data": { "id": "8", "source": "e", "target": "f", "weight": 2 } },
        { "data": { "id": "9", "source": "f", "target": "a", "weight": 1 } }
    ],
    style: [
        {
            selector: 'node',
            style: {
                'label': 'data(id)'
            }
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'label': 'data(weight)'
            }
        }
    ],
    //zoomingEnabled: false, // disable zooming
    //userZoomingEnabled: false // disable user zooming
});

document.getElementById('myButton').addEventListener('click', function () {
    console.log('Analyze button clicked!');
    var string = document.getElementById('adjMatInp').value;
    console.log("input text :\n", string);

    // string to 2D array
    var arr = string.split('\n').map(function (line) {
        return line.split(' ');
    });
    console.log("2D array :\n", arr);
    length = arr.length;
    console.log("length : ", length);

    addAdjMatTable(length, arr);
    addLinkedTable(length, arr);
    addNode(length, arr);

    warshall(length, arr);
    pathMatrix(length, arr);
});

function addNode(length, arr) {
    cy.remove(cy.elements());
    var nodes = [];
    for (var i = 0; i < length; i++) {
        nodes.push({ data: { id: String.fromCharCode(97 + i) } });
    }
    console.log("nodes : ", nodes);
    cy.add(nodes);

    var edges = [];
    for (var i = 0; i < length; i++) {
        for (var j = 0; j < length; j++) {
            if (arr[i][j] != 0) {
                edges.push({ data: { id: i + "" + j, source: String.fromCharCode(97 + i), target: String.fromCharCode(97 + j), weight: arr[i][j] } });
            }
        }
    }
    console.log("edges : ", edges);
    cy.add(edges);
}

document.getElementById('clearGraph').addEventListener('click', function () {
    console.log('Clear Button clicked!');
    cy.remove(cy.elements());
});

function addAdjMatTable(n, arr) {
    document.getElementById('adjText').style.visibility = 'visible';
    var myTableDiv = document.getElementById("adjMatTable");

    if (myTableDiv.hasChildNodes()) {
        myTableDiv.removeChild(myTableDiv.childNodes[0]);
    }

    var table = document.createElement('TABLE');

    table.className = 'table table-hover';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (var j = 0; j <= n; j++) {
        if (j == 0) {
            var th = document.createElement('TH');
            th.appendChild(document.createTextNode('#'));
            tr.appendChild(th);
            continue;
        }
        var th = document.createElement('TH');
        // th.appendChild(document.createTextNode("To " + toString(j+'a')));
        th.appendChild(document.createTextNode("To " + String.fromCharCode(96 + j)));
        tr.appendChild(th);
    }

    for (var i = 0; i < n; i++) {
        var tr = document.createElement('TR');
        var th = document.createElement('TH');
        // th.appendChild(document.createTextNode("From " + i));
        th.appendChild(document.createTextNode("From " + String.fromCharCode(96 + i + 1)));
        tr.appendChild(th);
        tableBody.appendChild(tr);

        for (var j = 0; j < n; j++) {
            var td = document.createElement('TD');
            td.appendChild(document.createTextNode(arr[i][j]));
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}

function addLinkedTable(n, arr) {
    document.getElementById('lnkText').style.visibility = 'visible';
    var myTableDiv = document.getElementById("linkedRepTable");

    while (myTableDiv.hasChildNodes()) {
        myTableDiv.removeChild(myTableDiv.childNodes[0]);
    }

    var table = document.createElement('TABLE');

    table.className = 'table table-hover';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode('Node'));
    tr.appendChild(th);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode("Adjacency List"));
    tr.appendChild(th);

    for (var i = 0; i < n; i++) {
        var tr = document.createElement('TR');
        var th = document.createElement('TH');
        // th.appendChild(document.createTextNode("From " + i));
        th.appendChild(document.createTextNode(String.fromCharCode(96 + i + 1)));
        tr.appendChild(th);
        tableBody.appendChild(tr);

        var data = "";
        for (var j = 0; j < n; j++) {
            if (arr[i][j] != 0) {
                data += String.fromCharCode(96 + j + 1) + " ";
            }
        }
        var td = document.createElement('TD');
        td.appendChild(document.createTextNode(data));
        tr.appendChild(td);
    }
    myTableDiv.appendChild(table);
}

function warshall(n, arr) {
    document.getElementById('warText').style.visibility = 'visible';

    var myTableDiv = document.getElementById("warMatTable");
    while (myTableDiv.hasChildNodes()) {
        myTableDiv.removeChild(myTableDiv.childNodes[0]);
    }

    var arr_temp = [];
    for (var i = 0; i < n; i++) {
        arr_temp[i] = [];
        for (var j = 0; j < n; j++) {
            if (arr[i][j] == "0") {
                arr_temp[i][j] = 9999;
            } else
                arr_temp[i][j] = parseInt(arr[i][j]);
        }
    }
    // console.log("arr: ", arr);

    for (var k = 0; k < n; k++) {
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (arr_temp[i][k] + arr_temp[k][j] < arr_temp[i][j]) {
                    arr_temp[i][j] = arr_temp[i][k] + arr_temp[k][j];
                }
            }
        }
        warTableDraw(n, arr_temp, k + 1);
    }
    console.log("Warshall's matrix :\n", arr_temp);
}

function warTableDraw(n, arr, k) {
    var myTableDiv = document.getElementById("warMatTable");
    var table = document.createElement('TABLE');
    table.className = 'table table-hover';

    // caption
    var caption = table.createCaption();
    if (n != k)
        caption.innerText = 'Warshall\'s Matrix after ' + k + ' iteration';
    else 
        caption.innerText = 'Warshall\'s Matrix after final iteration (shortest path or path matrix from a point to another)';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode('#'));
    tr.appendChild(th);
    for (var j = 0; j < n; j++) {
        var th = document.createElement('TH');
        th.appendChild(document.createTextNode("To " + String.fromCharCode(96 + j + 1)));
        tr.appendChild(th);
    }

    for (var i = 0; i < n; i++) {
        var tr = document.createElement('TR');
        var th = document.createElement('TH');
        th.appendChild(document.createTextNode("From " + String.fromCharCode(96 + i + 1)));
        tr.appendChild(th);
        tableBody.appendChild(tr);

        for (var j = 0; j < n; j++) {
            var td = document.createElement('TD');
            if (arr[i][j] == 9999) {
                td.appendChild(document.createTextNode("∞"));
            } else
                td.appendChild(document.createTextNode(arr[i][j]));
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}

function pathMatrix(n, arr) {
    document.getElementById('pathText').style.visibility = 'visible';

    var myTableDiv = document.getElementById("pathMatTable");
    while (myTableDiv.hasChildNodes()) {
        myTableDiv.removeChild(myTableDiv.childNodes[0]);
    }

    console.log("arr : ", arr);
    var arr_one = [];
    var arr_two = [];
    var arr_sum = [];
    for (var i = 0; i < n; i++) {
        arr_one[i] = [];
        arr_two[i] = [];
        arr_sum[i] = [];
        for (var j = 0; j < n; j++) {
            arr_one[i][j] = parseInt(arr[i][j]);
            arr_sum[i][j] = parseInt(arr[i][j]);
        }
    }
    console.log("arr_one : ", arr_one);

    for (var loop = 0; loop < n-1; loop++) {
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                var sum = 0;
                for (var k = 0; k < n; k++) {
                    sum = sum + arr_one[i][k] * arr[k][j];
                }
                arr_two[i][j] = sum;
            }
        }
        printTableMatrix(n, arr_two, loop + 1);
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                arr_one[i][j] = arr_two[i][j];
                arr_sum[i][j] = arr_sum[i][j] + arr_two[i][j];
            }
        }
    }

    printTableMatrix(n, arr_sum, n);
}

function printTableMatrix(n, arr_temp, loop) {
    var myTableDiv = document.getElementById("pathMatTable");
    var table = document.createElement('TABLE');
    table.className = 'table table-hover';

    // caption
    var caption = table.createCaption();
    if (n != loop)
        caption.innerText = 'Path Matrix after raising to the power ' + (loop + 1);
    else 
        caption.innerText = 'Path Matrix after final iteration (You can consider non-zero values as 1)';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode('#'));
    tr.appendChild(th);
    for (var j = 0; j < n; j++) {
        var th = document.createElement('TH');
        th.appendChild(document.createTextNode("To " + String.fromCharCode(96 + j + 1)));
        tr.appendChild(th);
    }

    for (var i = 0; i < n; i++) {
        var tr = document.createElement('TR');
        var th = document.createElement('TH');
        th.appendChild(document.createTextNode("From " + String.fromCharCode(96 + i + 1)));
        tr.appendChild(th);
        tableBody.appendChild(tr);

        for (var j = 0; j < n; j++) {
            var td = document.createElement('TD');
            if (arr_temp[i][j] == 9999) {
                td.appendChild(document.createTextNode("∞"));
            } else
                td.appendChild(document.createTextNode(arr_temp[i][j]));
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}
