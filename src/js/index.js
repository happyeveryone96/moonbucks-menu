// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [X] 메뉴의 이름을 입력받고 엔터키 입력으로 추가한다.
// - [X] 메뉴의 이름을 입력받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// - [X] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [X] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [X] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [X] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [X] 메뉴의 수정 버튼 클릭 이벤트를 받고, 메뉴 수정하는 모달창(prompt)이 뜬다.
// - [X] 모달창에서 신규 메뉴명을 입력받고, 확인 버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [X] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [X] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [X] 총 메뉴 갯수를 count하여 상단에 보여준다.

// step2 요구사항 분석
// TODO localStorage Read & Write
// - [X] localStorage에 데이터를 저장한다.
//  - [X] 메뉴를 추가할 때
//  - [X] 메뉴를 수정할 때
//  - [X] 메뉴를 삭제할 때
// - [X] localStorage에 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [X] 에스프레소 메뉴판 관리 
// - [X] 프라푸치노 메뉴판 관리 
// - [X] 블렌디드 메뉴판 관리
// - [X] 티바나 메뉴판 관리 
// - [X] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [X] 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [X] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [X] 품절 버튼을 추가한다.
// - [X] 품절 버튼을 클릭하면 localStoragedp 상태값이 저장된다.
// - [X] 클릭 이벤트에서 가장 가까운 li 태그의 class 속성 값에 sold-out을 추가한다.

// step3 요구사항 분석
// TODO 서버 요청 부분
// - [X] 웹 서버를 띄운다.
// - [X] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// - [X] 서버에 카테고리별 메뉴 리스트를 불러온다.
// - [X] 서버에 메뉴가 수정될 수 있도록 요청한다.
// - [X] 서버에 메뉴의 품절 상태가 토글될 수 있도록 요청한다.
// - [X] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// 리팩터링 부분
// - [X] localStorage에 저장하는 로직은 지운다.
// - [X] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [] 중복되는 메뉴는 추가할 수 없다.


import { $ } from './utils/dom.js';
import store from './store/index.js';
import MenuApi from './api/index.js';

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  }

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    const template = this.menu[this.currentCategory].map((item) => {
        return `
        <li data-menu-id="${item.id}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name ${item.isSoldOut ? 'sold-out' : ''}">${item.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
            삭제
          </button>
        </li>`;
      })
      .join('');


    $('#menu-list').innerHTML = template;
    updateMenuCount();
  }

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount}개`;
  }

  const addMenuName = async () => {
    if ($('#menu-name').value === '') {
      alert('값을 입력해주세요.');
      return;
    }
    const menuName = $('#menu-name').value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $('#menu-name').value = '';
  }

  const updateMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요', $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  }

  const removeMenuName = async (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  }

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  }

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  }

  const initEventListeners = () => {
    $('#menu-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    })

    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    $('#menu-submit-button').addEventListener('click', addMenuName);

    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      addMenuName();
    });

    $('nav').addEventListener('click', changeCategory);
  }
}

const app = new App();
app.init();