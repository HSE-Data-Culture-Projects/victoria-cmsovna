class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header>
                <div class="edit-page-header">
                    <h2 style="padding-left: 16px; color: azure;">CMS Data Culture</h2>
                    <div class="edit-page-header">
                        <button class="main-button" onclick="navigateTo('exams')">
                            <img src="assets/svg/edit.svg" alt="Экзамены" class="icon"> Экзамены
                        </button>
                        <button class="main-button" onclick="navigateTo('topics')">
                            <img src="assets/svg/edit.svg" alt="Темы" class="icon"> Темы
                        </button>
                        <button class="main-button" onclick="navigateTo('tasks')">
                            <img src="assets/svg/edit.svg" alt="Задания" class="icon"> Задания
                        </button>
                    </div>
                </div>
            </header>
        `;
    }
}

customElements.define('header-component', HeaderComponent);
