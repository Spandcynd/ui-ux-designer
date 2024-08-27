// utils

function reduceArrayOfFunctionsReturnValues(functionsArray) {
  return functionsArray.reduce((accumulator, func) => {
    return accumulator.concat(func());
  }, []);
}

const formFieldInfo = Object.freeze({
  errors: [],
  warnings: [],
  infos: [],
});

class Sourcer {
  #sources = {};

  constructor(sources) {
    if (!sources) return;
    this.#sources = sources;
  }

  addSource(group, source) {
    if (!this.#sources[group]) {
      this.#sources[group] = [source];
    } else {
      this.#sources[group].push(source);
    }
  }

  getData() {
    const result = {};
    for (const key of Object.keys(this.#sources)) {
      result[key] = reduceArrayOfFunctionsReturnValues(this.#sources[key]);
    }
    return result;
  }
}

function sourcerTest() {
  const sourcer = new Sourcer();

  function twitterNotify() {
    return 'Notification from Twitter!';
  }
  function youtubeNotify() {
    return 'Notification from Youtube!';
  }
  function facebookNotify() {
    return 'Notification from Facebook!';
  }

  sourcer.addSource('notifications', twitterNotify);
  sourcer.addSource('notifications', youtubeNotify);
  sourcer.addSource('notifications', facebookNotify);

  console.log(sourcer.getData());
}

function formFieldInfoSourcerTest() {
  const ffiSourcer = new Sourcer(formFieldInfo);

  function warningFromDb() {
    return 'Data you want to delete is marked as "essential"';
  }
  function inputError() {
    return 'Error while connecting to input port';
  }
  function invalidPassword() {
    return 'Your password is invalid';
  }
  function tip() {
    return 'You always can change font-size in settings';
  }

  ffiSourcer.addSource('warnings', warningFromDb);
  ffiSourcer.addSource('errors', inputError);
  ffiSourcer.addSource('errors', invalidPassword);
  ffiSourcer.addSource('infos', tip);

  console.log(ffiSourcer.getData());
}
sourcerTest();
formFieldInfoSourcerTest();
// class FormFieldInfo {
//   #errors = [];
//   #warnings = [];
//   #infos = [];

//   #errorSources = [];
//   #warningSources = [];
//   #infoSources = [];

//   addErrorSource(source) {
//     this.#errorSources.push(source);
//   }

//   #calcErrorMessages() {
//     this.#errors = reduceArrayOfFunctionsReturnValues(this.#errorSources);
//   }
//   #calcWarningMessages() {
//     this.#warnings = reduceArrayOfFunctionsReturnValues(this.#warningSources);
//   }
//   #calcInfoMessages() {
//     this.#infos = reduceArrayOfFunctionsReturnValues(this.#infoSources);
//   }

//   #calcMessages() {
//     this.#calcErrorMessages();
//     this.#calcWarningMessages();
//     this.#calcInfoMessages();
//   }

//   getInfo() {
//     this.#calcMessages();

//     return {
//       errors: [...this.#errors],
//       warnings: [...this.#warnings],
//       infos: [...this.#infos],
//     };
//   }
// }
