suite('Тесты страницы "О..."', function(){
  test('Страница должны содержать ссылку на страницу контактов', function(){
    assert($('a[href="/contact"]').length);
  })
})