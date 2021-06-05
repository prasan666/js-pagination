
let list = [];
let pageList = [];
let currentPage = 1;
let numberPerPage = 10;
let numberOfPages = 0;
let buttonArray = []
let editUser


async function makeList() {
    await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json').then(res => res.json(res))
        .then(res => {
            list = res;
            numberOfPages = getNumberOfPages();
        });
}

function getNumberOfPages() {
    return Math.ceil(list.length / numberPerPage);
}

function nextPage() {
    currentPage += 1;
    loadList();
    setFooter();
}

function previousPage() {
    currentPage -= 1;
    loadList();
    setFooter();
}

function firstPage() {
    currentPage = 1;
    loadList();
    setFooter();
}

function lastPage() {
    currentPage = numberOfPages;
    loadList();
    setFooter();
}

function loadList() {
    let begin = (currentPage - 1) * numberPerPage;
    let end = begin + numberPerPage;

    pageList = list.slice(begin, end);
    drawList();
    setFooter()
    check();
}

function drawList() {
    let tableBody = document.getElementById("table-body")
    tableBody.innerHTML = "";
    let listHtml = ''
    for (r = 0; r < pageList.length; r++) {
        let item = pageList[r]
        listHtml += `<tr>
            <th scope="row"><input type="checkbox" id=${item.id} onclick="onUserSelect(event , ${r})" /></th>
            <td>${item.name}</td>
            <td>${item.email}</td>
            <td>${item.role}</td>
            <td>
                <img width="20" height="20" src="assets/create-outline.svg"  onclick="editUserFunc(${r})" />
                <img width="20" height="20" src="assets/trash-outline.svg" onclick="deleteUser(${item.id})"/>
            </td>
        </tr>`
    }
    setTimeout(() => {
        tableBody.innerHTML = listHtml
    }, 10)
}

function check() {
    document.getElementById("next").disabled =
        currentPage == numberOfPages ? true : false;
    document.getElementById("previous").disabled =
        currentPage == 1 ? true : false;
    document.getElementById("first").disabled =
        currentPage == 1 ? true : false;
    document.getElementById("last").disabled =
        currentPage == numberOfPages ? true : false;
}

function deleteUser(id) {
    const newPageList = list.filter(user => user.id != id)
    list = newPageList;
    loadList()
}

function editUserFunc(ind) {
    editUser = pageList[ind];
    const modal = document.getElementsByClassName('modal-body');
    modal[0].innerHTML = `<div>
    <div>Name : <input class="form-control" type="text" id="userName" value="${editUser.name}"></div>
    <div>Email : <input class="form-control" type="email" id="userEmail" value="${editUser.email}"></div>
    <div>Role : <select id="select" class="form-select" value"${editUser.role}">
    <option value="admin">admin</option>
    <option value="member">member</option>
    
  </select></div>
    </div>`
    document.getElementById('id01').style.display = 'block';
}
function save() {
    let name = document.getElementById('userName').value
    let email = document.getElementById('userEmail').value
    let role = document.getElementById('select').value
    let temp = {
        name, email, role, id: editUser.id
    }
    pageList.forEach(user => {
        if (user.id == editUser.id) {
            user = temp
        }
    })
    list.forEach(user => {
        if (user.id == editUser.id) {
            user = temp
        }
    })
    loadList();
    document.getElementById('id01').style.display = 'none';


}

function onUserSelect(e, ind) {
    if (e.target.checked) {
        pageList[ind].checked = true
    } else {
        pageList[ind].checked = false
    }
}

function deleteSelectedusers() {
    let selectedUserIds = pageList.filter(user => user.checked).map(user => user.id)
    let newPageList = list.filter(user => !selectedUserIds.includes(user.id))
    list = newPageList;
    loadList()
}

function toggle(e) {
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((node, ind) => {
        node.checked = e.target.checked
    })
    pageList.forEach(item => {
        item.checked = e.target.checked
    })
}
function setFooter() {
    buttonArray = []
    let buttonDiv = document.getElementById('page-number-buttons');
    buttonDiv.innerHTML = ''
    // if (currentPage)
    if (currentPage > 2) {
        buttonArray = [currentPage - 1, currentPage, currentPage + 1]
    } else if (currentPage == numberOfPages) {
        buttonArray = [numberOfPages - 2, numberOfPages - 1, numberOfPages]
    } else {
        buttonArray = [1, 2, 3]
    }

    for (let i = 0; i < 3; i++) {
        let page = document.createElement("div");
        // page.innerHTML = i + 1;
        page.innerHTML = buttonArray[i];
        page.className = "pager-item btn rounded-circle mx-2";
        if (currentPage == page.innerHTML) page.className += ' selected'
        page.addEventListener('click', function () {
            let parent = this.parentNode;
            let items = parent.querySelectorAll(".pager-item");
            for (let x = 0; x < items.length; x++) {
                items[x].classList.remove("selected");
            }
            if (this.innerHTML <= numberOfPages) {
                currentPage = Number(this.innerHTML)
                loadList();
            }
        });
        buttonDiv.appendChild(page)
    }

}

async function load() {
    await makeList();
    loadList();
}
load();