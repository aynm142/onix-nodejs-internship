# Installation 
install all dependencies:
```
$ npm install
```

run server:

```
$ node index.js
```

# API documentation

**POST "/" form-data**<br>
`todo` : 1 - resize, 2 - crop<br>
**if todo == 1:<br>**
    `width` : int - pixels wide the resultant image should be<br>
    `heigth` : int - pixels high the resultant image should be<br>
**if todo == 2:<br>**
    `top` : int - zero-indexed offset from top edge<br>
    `left` : int - zero-indexed offset from left edge<br>
`image` : file


