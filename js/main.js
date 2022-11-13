// LEST AND TEMPLATE 
const elList = document.querySelector(".book-list");
const elSaveList = document.querySelector(".book-save-list");
// const elBtnBookmark = document.querySelector(".bokkmark");
const elBookTemplate = document.querySelector(".book-template").content;
const elBookmarkTemplate = document.querySelector(".book-save-template").content;
const bookFragment = document.createDocumentFragment();

// FORM 
const elForm = document.querySelector(".book-form");
const elInputSearch = document.querySelector(".book-search-input");
const elInputSearchAuthor = document.querySelector(".book-author-input");
const elInputSearchYear = document.querySelector(".book-year-input");
const elLanguageCatigoria = document.querySelector(".book-language-categoria");
const elSort = document.querySelector(".book-sort");

// LANGUAGE CATIGORIA
const arrayLanguage = [];
books.forEach(item =>{
    if(!arrayLanguage.includes(item.language)){
        arrayLanguage.push(item.language)
    }
})
arrayLanguage.forEach(item => {
    const newOption = document.createElement("option");
    newOption.textContent = item;
    elLanguageCatigoria.appendChild(newOption)
});

renderFunc(books);
function renderFunc(arr , regex = "", regaut = ""){
    elList.innerHTML = "";
    arr.forEach(item => {
        const bookClone = elBookTemplate.cloneNode(true);
        bookClone.querySelector(".book-img").src = item.imageLink;
        bookClone.querySelector(".book-img").alt = item.title;
        
        if(regex.source != "(?:)" && regex){
            bookClone.querySelector(".book-title").innerHTML = item.title.replace(regex, `<mark style="background-color: #F0BBB3;">${regex.source.toLowerCase()}</mark>`);
        }else{
            bookClone.querySelector(".book-title").textContent = item.title;
        }
        
        if(regaut.source != "(?:)" && regaut){
            bookClone.querySelector(".book-author").innerHTML = item.author.replace(regaut, `<mark style="background-color: #e9b799;">${regaut.source.toLowerCase()}</mark>`);
        }else{
            bookClone.querySelector(".book-author").textContent = item.author;
        }
        bookClone.querySelector(".book-year").textContent = item.year;
        bookClone.querySelector(".book-page").textContent = item.pages;
        bookClone.querySelector(".bokkmark").dataset.id = item.id;
        bookClone.querySelector(".book-language").textContent = item.language;
        bookClone.querySelector(".book-wik").href = item.link;
        bookFragment.appendChild(bookClone);
    });
    elList.appendChild(bookFragment);
}

const localSave = JSON.parse(localStorage.getItem("bookmark"));
const bookArray = localSave || [];
function saveFunc(arraysave){
    elSaveList.innerHTML = "";
    arraysave.forEach(item => {
        const bookCloneTemplate = elBookmarkTemplate.cloneNode(true);
        bookCloneTemplate.querySelector(".book-img").src = item.imageLink;
        bookCloneTemplate.querySelector(".book-title").textContent = item.title;
        bookCloneTemplate.querySelector(".book-author").textContent = item.author;
        bookCloneTemplate.querySelector(".btn-dell-bookmark").dataset.id = item.id;
        bookFragment.appendChild(bookCloneTemplate);
    });
    elSaveList.appendChild(bookFragment);
    localStorage.setItem("bookmark", JSON.stringify(bookArray));
}
saveFunc(bookArray);

elList.addEventListener("click", evt =>{
    if(evt.target.matches(".bokkmark")){
        const bookId = evt.target.dataset.id;
        const bookFind = books.find(el => el.id == bookId);
        
        if(!bookArray.includes(bookFind)){
            bookArray.push(bookFind);
            saveFunc(bookArray);
        }
        localStorage.setItem("bookmark", JSON.stringify(bookArray));
    }
})
elSaveList.addEventListener("click" ,evt =>{
    if(evt.target.matches(".btn-dell-bookmark")){
        const delBtnId = evt.target.dataset.id;
        const delBtnFinIndex = bookArray.findIndex(el => el.id == delBtnId);
        bookArray.splice(delBtnFinIndex, 1)
        localStorage.setItem("bookmark", JSON.stringify(bookArray));
        saveFunc(bookArray)
    }
})

function sortFunc(array, sortval){
    if(sortval.value == "a-z"){
        array.sort((a,b) =>{
            if(a.title > b.title){
                return 1
            }
            if(a.title < b.title){
                return -1
            }
            return 0
        })
    }
    
    if(sortval.value == "z-a"){
        array.sort((a,b) =>{
            if(a.title > b.title){
                return -1
            }
            if(a.title < b.title){
                return 1
            }
            return 0
        })
    }
    
    if(sortval.value == "start-year"){
        array.sort((a,b) => parseFloat(a.year) - parseFloat(b.year))
    }
    if(sortval.value == "end-year"){
        array.sort((a,b) => parseFloat(b.year)  - parseFloat(a.year))
    }
    if(sortval.value == "few-sheets"){
        array.sort((a,b) => a.pages - b.pages)
    }
    if(sortval.value == "many-sheets"){
        array.sort((a,b) => b.pages - a.pages)
    }
}

elForm.addEventListener("submit", evt => {
    evt.preventDefault();
    const inputregEx = new RegExp(elInputSearch.value, "gi");
    const authortregEx = new RegExp(elInputSearchAuthor.value, "gi");
    sortFunc(books, elSort)
    const search = books.filter(item =>{
        const searchFilter = item.title.match(inputregEx) && (item.author.match(authortregEx) || elInputSearchAuthor.value == "")
        && ( elInputSearchYear.value <= item.year || elInputSearchYear.value == "")
        && (item.language.includes(elLanguageCatigoria.value) || elLanguageCatigoria.value == "all")
        return searchFilter
    })
    if(search.length > 0){
        renderFunc(search , inputregEx, authortregEx)
    }else{
        elList.innerHTML = "Not Found !!!"
    }
})