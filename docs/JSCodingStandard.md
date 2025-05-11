# Javascript 컨벤션

> https://github.com/airbnb/javascript?tab=readme-ov-file 참고

- 가독성을 최우선으로 삼는다. (대부분의 경우 코드 그 자체가 문서의 역할을 해야 함)
- 합당한 이유가 있지 않는 한, 통합개발환경(IDE)의 자동 서식을 따른다. (VS Code의 "Shift + Alt + F" 기능)

## 소스파일 기본

- 소스파일의 이름은 알파벳 소문자, 하이픈( - ), 밑줄( \_ ), 점(.) 으로만 작성한다.
- 소스파일의 확장자명은 .js/ts 으로 작성한다.
- 소스파일의 인코딩은 UTF-8 으로 작성한다.
- 탭을 이용한 들여쓰기는 하지 않는다.

## 형식

- Prettier를 사용한 설정을 기본으로 사용한다
  - .prettierrc를 통해 singleQuote: true를 추가한 형식을 사용한다

### 중괄호

- 중괄호는 하나의 구문만을 포함하고 있더라도 모든 제어문(i.e. if, else, for, do, while..)에 사용되어야 한다.

```javascript
// bad
if (someVeryLongCondition()) doSomething();

// No
for (let i = 0; i < foo.length; i++) bar(foo[i]);

// Yes
if (shortCondition()) {
  foo();
}
```

- 중괄호의 사용은 Kernighan and Ritchie Style에 따른다.
  - 여는 중괄호 전에는 줄을 바꾸지 않는다.
  - 여는 중괄호 이후에 줄을 바꾼다.
  - 닫는 중괄호 전에 줄을 바꾼다.
  - 닫는 중괄호 이후에 줄을 바꾼다. 단, 닫는 중괄호 다음에 else, catch, while, 점, 세미콜론, 닫는 소괄호가 따라올 경우에는 줄을 바꾸지 않는다.

```javascript
class InnerClass {
  constructor() {}

  /** @param {number} foo */
  method(foo) {
    if (condition(foo)) {
      try {
        something();
      } catch (err) {
        recover();
      }
    }
  }
}
```

## 변수

- 한 줄에 하나의 변수를 선언한다

```javascript
// bad
let a = 1,
  b = 3;

// good
let a = 1;
let b = 2;
```

- 지역 변수는 그 변수를 포함하는 블록 시작에서 선언하지 않고, 사용 범위를 최소화하기 위해 사용되는 지점과 가장 가까운 곳에서 선언한다.
- 변수의 선언은 const를 사용한다. mutable한 경우만 let을 사용하고 var는 사용하지 않는다

## 배열

- 배열을 선언할 때는 Array 생성자가 아닌 리터럴 구문을 사용한다.
- 배열에 값을 넣을 때는 Array.push를 사용한다.
- 배열을 복사할 때는 배열의 spread 연산자를 사용한다.

## 객체

- 오브젝트를 선언할 때는 Object 생성자가 아닌 리터럴 구문을 사용한다.
- 예약어를 키로 사용하지 않는다. 대신, 동의어를 사용한다.

## 클래스

- 상속의 사용은 최대한 피하며, 반드시 필요한 경우에만 사용한다
- prototype을 조작하지 않고 class를 사용한다

```javascript
// bad
function Queue(contents = []) {
  this._queue = [...contents];
}
Queue.prototype.pop = function () {
  const value = this._queue[0];
  this._queue.splice(0, 1);
  return value;
};

// good
class Queue {
  constructor(contents = []) {
    this._queue = [...contents];
  }
  pop() {
    const value = this._queue[0];
    this._queue.splice(0, 1);
    return value;
  }
}
```

## 화살표 함수

- 함수 바디가 하나의 식으로 구성된 경우, 중괄호와 return문을 생략할 수 있다.
  중괄호를 생략하지 않을 경우, return문을 포함시켜야 한다.

```javascript
// good
[1, 2, 3].map((number) => `A string containing the ${number}.`);

// bad
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  return `A string containing the ${nextNumber}.`;
});
```

- 식이 여러 줄에 걸쳐있을 경우에 가독성을 위해 소괄호로 감싸 사용한다.
  - 함수의 인수가 하나인 경우 소괄호를 생략할 수 있다.

```javascript
// bad
[1, 2, 3].map(
  (number) =>
    "As time went by, the string containing the " +
    `${number} became much longer. So we needed to break it over multiple ` +
    "lines."
);

// good
[1, 2, 3].map(
  (number) =>
    `As time went by, the string containing the ${number} became much ` +
    "longer. So we needed to break it over multiple lines."
);

// good
[1, 2, 3].map((x) => x * x);

// good
[1, 2, 3].reduce((y, x) => x + y);
```

## 문자열

- 문자열을 선언할 때는 작은 따옴표( ' )를 사용한다.
  문자열 내에 작은 따옴표가 포함될 경우 템플릿 리터럴( ` ` )을 사용한다.
- 동적으로 문자열을 생성할 경우에는 문자열 연결이 아닌 템플릿 리터럴을 사용한다.
- 80글자 이상의 긴 문자열을 여러 줄에 걸쳐 쓰기 위해서는 템플릿 리터럴을 사용한다
- eval()은 금지한다

## 제어문

- 일반적인 for문 보다는 for-of를 사용한다.
  하지만, 가능하다면 map(), reduce()와 같은 고급 함수를 사용한다
- 스위치문의 다음 case 구문이 실행되어야 한다면 주석으로 이를 남긴다. default문은 항상 마지막에 위치한다
- this키워드는 클래스 생성자와 메소드, 혹은 그 안에서 선언된 화살표 함수 내에서만 사용한다.

## 네이밍

- 단일 글자로 이름을 짓지 않고 이름을 통해 쓰임새를 알 수 있도록 한다.
- 이름의 맨 앞이나 맨 뒤쪽에 밑줄( \_ )을 이용해 private를 표현한다
- 가독성을 위해 약어는 모두 대문자 혹은 모두 소문자로 표기한다.
- export되는 파일 내의 모든 상수는 모두 대문자로 표기한다.

## 파일 및 패키지

- 파일의 이름은 소문자로 표기한다.
- 파일의 이름은 default export의 이름과 일치해야한다.

```javascript
// file 1 contents
class CheckBox {
  // ...
}
export default CheckBox;

// file 2 contents
export default function fortyTwo() { return 42; }

// file 3 contents
export default function insideDirectory() {}

// in some other file
// bad
import CheckBox from './checkBox'; // PascalCase import/export, camelCase filename
import FortyTwo from './FortyTwo'; // PascalCase import/filename, camelCase export
import InsideDirectory from './InsideDirectory'; // PascalCase import/filename, camelCase export

// bad
import CheckBox from './check_box'; // PascalCase import/export, snake_case filename
import forty_two from './forty_two'; // snake_case import/filename, camelCase export
import inside_directory from './inside_directory'; // snake_case import, camelCase export
import index from './inside_directory/index'; // requiring the index file explicitly
import insideDirectory from './insideDirectory/index'; // requiring the index file explicitly

// good
import CheckBox from './CheckBox'; // PascalCase export/import/filename
import fortyTwo from './fortyTwo'; // camelCase export/import/filename
import insideDirectory from './insideDirectory'; // camelCase export/import/directory name/implicit "index"
// ^ supports both insideDirectory.js and insideDirectory/index.js
```

## 변수명

- 변수의 이름은 lowerCamelCase로 표기한다. 단, export되는 파일 내의 상수는 예외.
- 변수의 이름은 알파벳으로 시작해야한다
- 최대한 다음의 규칙을 따른다
  - 1. 변수 이름에는 동사를 넣지 않는다
  - 2. 변수의 단수형에는 관사를 넣지 않는다.
  - 3. 전치사는 최대한 생략한다

## 클래스

- 클래스나 생성자의 이름은 PascalCase로 표기한다.
- 클래스의 이름은 명사 또는 명사구문으로 표기한다.
- 인터페이스의 경우 명사 대신 형용사 또는 형용사구문으로 표기할 수 있다.
- 클래스를 export할 때는 PascalCase로 표기한다.
