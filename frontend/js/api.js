function showPage(id, el) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');

    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
    if (el) el.classList.add('active');
}

function openAuth() {
    document.getElementById('auth').classList.add('active');
}

function closeAuth() {
    document.getElementById('auth').classList.remove('active');
}
