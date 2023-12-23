const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const identitasContainer = document.querySelector('.identitas-container');
const signUpContainer = document.querySelector('.sign-up-container');
const signContainer = document.querySelector('.sign-in-container');
const overlayContainer = document.querySelector('.overlay-container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    document.title = "Sign Up";
    signContainer.style.display = 'none';
    overlayContainer.style.display = 'none';
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    document.title = "Login";
    signContainer.style.display = 'block';
    overlayContainer.style.display = 'block';
});

document.addEventListener('DOMContentLoaded', function () {
    var fakultasSelect = document.getElementById('fakultas');
    var prodiSelect = document.getElementById('prodi');

    fakultasSelect.addEventListener('change', function () {
        var selectedFakultas = fakultasSelect.value;
        prodiSelect.innerHTML = '<option value="" disabled selected>Select your program</option>';

        var prodiOptions = [];

        switch (selectedFakultas) {
            case 'Fakultas Teknik Elektro':
                prodiOptions = ['Teknik Elektro', 'Teknik Telekomunikasi', 'Teknik Komputer'];
                break;
            case 'Fakultas Rekayasa Industri':
                prodiOptions = ['Teknik Industri', 'Sistem Informasi', 'Teknik Logistik'];
                break;
            case 'Fakultas Informatika':
                prodiOptions = ['Informatika', 'Rekayasa Perangkat Lunak', 'Teknologi Informasi', 'Data Science'];
                break;
            case 'Fakultas Industri Kreatif':
                prodiOptions = ['Desain Komunikasi Visual', 'Desain Interior', 'Fashion Textile Design'];
                break;
            case 'Fakultas Komunikasi dan Bisnis':
                prodiOptions = ['Administrasi Bisnis', 'Ilmu Komunikasi', 'Hubungan Masyarakat'];
                break;
            case 'Fakultas Ekonomi dan Bisnis':
                prodiOptions = ['Akuntansi', 'Manajemen', 'Manajemen Bisnis TI'];
                break;
            case 'Fakultas Ilmu Terapan':
                prodiOptions = ['Teknik Informatika', 'Perhotelan', 'Sistem Informasi Akuntansi'];
                break;
            default:
                break;
        }

        addProdiOptions(prodiOptions);
    });
});

function addProdiOptions(options) {
    var prodiSelect = document.getElementById('prodi');
    options.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        prodiSelect.appendChild(optionElement);
    });
}