//Equal color
var EqualColor = "#45ADA8"
var AnswerColor = "#9DE0AD"
var parser = undefined;

// https://stackoverflow.com/questions/7439210/remove-styles-from-text-when-copying-cutting-using-css-or-javascript
document.addEventListener('copy', function(e) {
    const text_only = document.getSelection().toString();
    const clipdata = e.clipboardData || window.clipboardData;  
    clipdata.setData('text/plain', text_only);
    clipdata.setData('text/html', text_only);
    e.preventDefault();
});

window.onload = function (e) {
    var editor = document.getElementById("editor");
    editor.focus();
    editor.onkeyup = (e) => { update(); };
    math.config({
        epsilon: 1e-12,
        matrix: 'Matrix',
        number: 'BigNumber',
        precision: 8,
        predictable: false,
        randomSeed: null
    });
    parser = math.parser();
}

function update()
{
    parser = math.parser();
    var editor = document.getElementById("editor");
    var above = document.getElementById("above");
    Array.from(document.getElementsByClassName("answer")).forEach((x) => remove(x));
    var outp = editor.value.split("\n").map((x) => processAnswer(x));
    above.innerHTML = outp.join("");

    //doesn't work!
    // if (!editor.value.endsWith("\n") && editor.value != "") editor.value += "\n"; //add newline if there is no newline at the end
    //console.log(outp.join(""));
}

function processAnswer(question)
{
    //console.log(question);
    var ans = undefined;
    try {
        ans = parser.evaluate(question);
    } catch (error) { }
    
    var chtml = "";
    if (ans != undefined)
    {
        chtml += new Array(question.length + 1).join("&nbsp");
        chtml += '&nbsp<span style="pointer-events: all;">' //added space to transparent layer
        chtml += '<span style="color:' + EqualColor + ';">= </span>'; //removed space from left side of =
        chtml += '<span style="color:' + AnswerColor + ';">' + humanAns(ans, question) + '</span>';
        chtml += '</span>'
        parser.set('ans', ans)
    }
    return chtml + "</br>";
}

function textToHTML(text)
{
    var elem = document.createElement('span');
    elem.innerText = text;
    return elem.innerHTML;
}

function humanAns(tAns, question)
{
    if (typeof tAns === 'function')
    {
        return question;
    }
    return String(tAns)
}