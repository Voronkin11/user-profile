const dropdownMenuTogler = (btnId, listId, activeClassName) => {
    const dropdownMenuBtn = document.getElementById(btnId);
    const dropdownMenuList = document.getElementById(listId);

    dropdownMenuBtn.addEventListener("click", (evt) => {
        evt.preventDefault();
        dropdownMenuList.classList.toggle(activeClassName);
    })
    console.log(dropdownMenuBtn)
}

dropdownMenuTogler("dropBtn", "dropList","dropdown-menu__list--checked");