$(document).ready(function () {
    let categories = [];

    // ローカルストレージからデータをロード
    function loadFromLocalStorage() {
        const storedData = localStorage.getItem('categories');
        if (storedData) {
            categories = JSON.parse(storedData);
            categories.forEach((categoryData, categoryIndex) => {
                // カテゴリ行を追加
                const newRow = $(`
                    <tr>
                        <td>
                            <input type="text" value="${categoryData.categoryName}" class="category-name" />
                            <button class="delete-category-btn">カテゴリ削除</button>
                        </td>
                        <td><button class="add-element-btn">+ 要素追加ボタン</button></td>
                    </tr>
                `);
                $('#category-table tr:last').before(newRow);

                // カテゴリ名変更時に保存
                newRow.find('.category-name').on('input', saveToLocalStorage);

                // カテゴリ削除ボタンのイベントを設定
                newRow.find('.delete-category-btn').on('click', function () {
                    deleteCategory(categoryIndex);
                });

                // 要素を追加
                categoryData.items.forEach((elementName, elementIndex) => {
                    const elementInput = $(`<input type="text" value="${elementName}" class="element-name" />`);
                    const deleteElementButton = $('<button class="delete-element-btn">要素削除</button>');
                    newRow.find('td:last').before($('<td>').append(elementInput).append(deleteElementButton));

                    // 要素名変更時に保存
                    elementInput.on('input', saveToLocalStorage);

                    // 要素削除ボタンのイベントを設定
                    deleteElementButton.on('click', function () {
                        deleteElement(categoryIndex, elementIndex);
                    });
                });

                // 要素追加ボタンのイベントを再設定
                newRow.find('.add-element-btn').on('click', function () {
                    addElementToCategory(categoryIndex, newRow);
                });
            });
        }
    }

    // ローカルストレージに保存
    function saveToLocalStorage() {
        const dataToSave = categories.map((categoryData, index) => {
            if (!categoryData.items) {
                categoryData.items = [];
            }

            return {
                categoryName: $(`#category-table tr:eq(${index}) .category-name`).val(),
                items: $(`#category-table tr:eq(${index}) .element-name`).map(function (index, item) {
                    return $(item).val()
                }).toArray()
            };
        }).filter(Boolean); // 無効なデータを除外
        localStorage.setItem('categories', JSON.stringify(dataToSave));
    }

    // カテゴリ追加ボタン
    $('.add-category-btn').on('click', function () {
        const categoryIndex = categories.length;
        categories.push({ categoryName: `カテゴリ${categoryIndex + 1}`, items: [] });

        const newRow = $(`
            <tr>
                <td>
                    <input type="text" placeholder="カテゴリ${categoryIndex + 1}" class="category-name" />
                    <button class="delete-category-btn">カテゴリ削除</button>
                </td>
                <td><button class="add-element-btn">+ 要素追加ボタン</button></td>
            </tr>
        `);

        $('#category-table tr:last').before(newRow);

        // カテゴリ名変更時に保存
        newRow.find('.category-name').on('input', saveToLocalStorage);

        // カテゴリ削除ボタンのイベント
        newRow.find('.delete-category-btn').on('click', function () {
            deleteCategory(categoryIndex);
        });

        // 要素追加ボタンのクリックイベント
        newRow.find('.add-element-btn').on('click', function () {
            addElementToCategory(categoryIndex, newRow);
        });

        saveToLocalStorage(); // カテゴリ追加時に保存
    });

    // 要素をカテゴリに追加
    function addElementToCategory(categoryIndex, row) {
        const elementIndex = categories[categoryIndex].items.length;
        const elementInput = $(`<input type="text" placeholder="要素${categoryIndex + 1}-${elementIndex + 1}" class="element-name" />`);
        const deleteElementButton = $('<button class="delete-element-btn">要素削除</button>');

        if (!categories[categoryIndex].items) {
            categories[categoryIndex].items = [];
        }

        // items配列に要素を追加
        categories[categoryIndex].items.push(elementInput);
        row.find('td:last').before($('<td>').append(elementInput).append(deleteElementButton));

        // 要素名変更時に保存
        elementInput.on('input', saveToLocalStorage);

        // 要素削除ボタンのイベント
        deleteElementButton.on('click', function () {
            deleteElement(categoryIndex, elementIndex);
        });

        saveToLocalStorage(); // 要素追加時に保存
    }

    // カテゴリ削除
    function deleteCategory(categoryIndex) {
        categories.splice(categoryIndex, 1);
        $('#category-table tr:eq(' + categoryIndex + ')').remove(); // カテゴリ行削除
        saveToLocalStorage(); // 削除後に保存
    }

    // 要素削除
    function deleteElement(categoryIndex, elementIndex) {
        categories[categoryIndex].items.splice(elementIndex, 1);
        const categoryRow = $('#category-table tr:eq(' + categoryIndex + ')');
        categoryRow.find('td').eq(elementIndex + 1).remove(); // 対応する要素削除
        saveToLocalStorage(); // 削除後に保存
    }

    // ランダムボタン
    $('#random-btn').on('click', function () {
        let result = '';

        
        const storedData = localStorage.getItem('categories');
        if (storedData) {
            categories = JSON.parse(storedData);
        }

        categories.forEach(function (categoryData, index) {
            if (categoryData.items.length > 0) {
                const randomElement = categoryData.items[Math.floor(Math.random() * categoryData.items.length)];
                const elementValue = randomElement;
                result += `${elementValue},`;
            }
        });

        $('#result').text(result.slice(0, -1).trim());
    });

    // コピー機能
    $('#copy-btn').on('click', function () {
        const resultText = $('#result').text();
        if (resultText) {
            navigator.clipboard.writeText(resultText)
                .then(() => alert('結果がクリップボードにコピーされました！'))
                .catch(err => alert('コピーに失敗しました。'));
        } else {
            alert('コピーするテキストがありません。');
        }
    });

    // 初期化：ローカルストレージから復元
    loadFromLocalStorage();
});
