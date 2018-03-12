$('user-form__input-title, .user-form__input-body').on('keyup', updateButtonState);
$('ul').on('blur', '.ideabox__li-title', editContent);
$('ul').on('blur','.ideabox__li-body', editContent);
$('.ideabox__container').on('keypress', '.ideabox__input-search', filter);
$('.user-form__button-save').on('click', createIdea);
$('ul').on('click', '.ideabox__button-delete', deleteCard);
$('ul').on('click', '.downvote', downVote);
$('ul').on('click', '.upvote', upVote);
$('.user-form__button-save').prop('disabled', true);

persistUserData();

class Idea {
  constructor(userInputTitle, userInputBody) {
    this.id = Date.now();
    this.title = $('.user-form__input-title').val();
    this.body = $('.user-form__input-body ').val();
    this.quality = ['swill', 'plausible', 'genius'];
    this.qualityCounter = 0;
  };
};

function createIdea(e) {
  e.preventDefault();
  var newIdea = new Idea();
  prependUserData(newIdea);
  $('.user-form__input').val('');
  updateButtonState();
  sendToStorage(newIdea);
  getFromStorage(newIdea);
}

function updateButtonState() {
  ($('.user-form__input-title').val().length > 0 && $('.user-form__input-body').val().length > 0)
    ? $('.user-form__button-save').prop('disabled', false)
    : $('.user-form__button-save').prop('disabled', true);
}

function upVote() {
  var object = getFromStorage(this.parentElement.id);
  if(object.qualityCounter < 2) {
    object.qualityCounter++;
  }
  $('#idea_quality').text(object.quality[object.qualityCounter]);
  sendToStorage(object);
}

function downVote(e) {
  var object = getFromStorage(this.parentElement.id);
  if(object.qualityCounter > 0) {
    object.qualityCounter--;
  }
  $('#idea_quality').text(object.quality[object.qualityCounter]);
  sendToStorage(object);
}

function deleteCard() {
  this.parentElement.remove();
  localStorage.removeItem(this.parentElement.id);
}

function sendToStorage(newIdea) {
  var storeNewObject = newIdea;
  var stringifyNewObject = JSON.stringify(storeNewObject);
  localStorage.setItem(newIdea.id, stringifyNewObject);
}

function getFromStorage(newIdea) {
  var retrieveObject = localStorage.getItem(newIdea);
  var parsedObject = JSON.parse(retrieveObject);
  return parsedObject;
}

function editContent() {
  var parsedObject = getFromStorage($(this).parent().attr('id'));
  console.log(this.className);
  (this.className === 'ideabox__li-title')
    ? parsedObject.title = $(this).text()
    : parsedObject.body = $(this).text();
  parsedObject.body = $(this).text();
  sendToStorage(parsedObject);
}

function prependUserData(idea) {
  $('ul').prepend(`
    <li class="ideabox__li" id="${idea.id}">
      <h2 id="idea.title" class="ideabox__li-title" contenteditable="true">${idea.title}</h2>
      <button class="ideabox__button-delete"></button>
      <p class="ideabox__li-body" contenteditable="true" id="idea.body">${idea.body}</p>
      <button class="upvote"></button>
      <button class="downvote"></button>
      <p class="ideabox__li-quality">quality:<span id="idea_quality">${idea.quality[idea.qualityCounter]}</span></p>
      <hr>
    </li>`);
}

function persistUserData() {
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
    prependUserData(ideaFromStorage);
  }
}

function filter() {
  var searchWord = $(this).val().toUpperCase();
  for (var i = 0 ; i < localStorage.length ; i++) {
    var ideaFromStorage = getFromStorage(localStorage.key(i));
    var ideaTitle = ideaFromStorage.title.toUpperCase();
    var ideaBody = ideaFromStorage.body.toUpperCase();
    if ((ideaTitle.includes(searchWord) || ideaBody.includes(searchWord)) && searchWord.length !== 0){
      $('ul').html(' ')
      prependUserData(ideaFromStorage);
    }
  }
}
