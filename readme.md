# Installation 
install all dependencies:
```
$ npm install
```

run server:

```
$ node app.js
```

simple UI:

```
GET "/"
```

# API documentation

### POST "/" form-data<br>
`todo` : 1 - resize, 2 - crop<br>
`image` : file<br>

**if todo == 1:<br>**
* `width` : int - pixels wide the resultant image should be<br>
* `heigth` : int - pixels high the resultant image should be<br>

**if todo == 2:<br>**
*    `top` : int - zero-indexed offset from top edge<br>
*    `left` : int - zero-indexed offset from left edge<br>



### GET "/log" 
optional params:<br>
* `from` : str - start from this date (including) format dd-mm-yyyy<br> 
* `to` : str - start from (including) format dd-mm-yyyy<br> 

**example:** http://localhost:3000/log?from=19-10-2020&to=21-10-2020


