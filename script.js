
/* หน้า Home → หน้าใส่ชื่อ */

function goToNamePage() {
    window.location.href = "name.html";
}


/* หน้าใส่ชื่อ → หน้าเลือก chapter */

function enterName() {

    const name = document.getElementById("playerName").value;

    // ตรวจสอบว่าผู้เล่นใส่ชื่อหรือยัง
    if (name.trim() === "") {

        alert("Please enter your name.");

        return;
    }

    // เก็บชื่อผู้เล่นไว้
    localStorage.setItem("playerName", name);

    // ไปหน้าเลือก chapter
    window.location.href = "menu.html";
}


/* กลับหน้า Home */

function goHome() {
    window.location.href = "index.html";
}

/* ปุ่มย้อนกลับ */
function goBack() {
    window.history.back();
}

/*หน้าเลือก chapter ไป หน้า 4 */

function goTochap1() {
    window.location.href = "chap1.html";
}


/* หน้าเลือก chapter ไป หน้า 5 */

function goTochap2() {
    window.location.href = "chap2.html";
}


/* หน้าเลือก chapter ไป หน้า 6 */

function goTochap3() {
    window.location.href = "chap3.html";
}

function goToLevel1(){
    window.location.href = "chap2/chap2.html";
}
function goToRatio1(){
    window.location.href = "chap1.html";
}
