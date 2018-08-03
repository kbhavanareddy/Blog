

var comments = [];
var users = [];
var posts = [];


jQuery(document).on('click','#get_data',function(){
    usersData();
    jQuery('#get_data').hide();
  })



  
  if(!localStorage.getComments && !localStorage.getUsers && !localStorage.getPosts ){
    jQuery('#get_data').show(); 
}
  else{
      jQuery('#get_data').hide();
      users = JSON.parse(localStorage.getUsers);
      comments = JSON.parse(localStorage.getComments);
      posts = JSON.parse(localStorage.getPosts);
      display_data();
      //console.log(user_array);
      //console.log(comment_array);
      //console.log(post_array);
  }



  
function usersData(){

    var userPromise = new Promise(function (res, rej){
        $.ajax({
            type: "GET",
            url: "https://jsonplaceholder.typicode.com/users",
              success: function(user) {
                        res(user);
              },
              error: function(err) {
                      rej(err);
              }
        });
      });



    var commentPromise = new Promise(function (res, rej){
        $.ajax({
          type: "GET",
              url: "https://jsonplaceholder.typicode.com/comments",
              success: function(comment) {
                        res(comment);
              },
              error: function(err) {
                      rej(err);
              }
        });
      });




    var postPromise = new Promise(function (res, rej){
        $.ajax({
          type: "GET",
              url: "https://jsonplaceholder.typicode.com/posts",
              success: function(post) {
                        res(post);
              },
              error: function(err) {
                      rej(err);
              }
      });

    });




    Promise.all([userPromise, commentPromise, postPromise]).then(function(data){

        if(data[0]){
           
          localStorage.getUsers = JSON.stringify(data[0]);
          users = JSON.parse(localStorage.getUsers);
          console.log(users);
        }

        if(data[1]){
            localStorage.getComments = JSON.stringify(data[1]);
            comments = JSON.parse(localStorage.getComments);
            console.log(comments);
      
          }
            
        if(data[2]){
              
            for(var i=0; i<data[2].length; i++)
            {
                  var obj = {
                      "userId" : data[2][i]["userId"],
                      "body" : data[2][i]["body"],
                      "id" : data[2][i]["id"],
                      "title" : data[2][i]["title"],
                     "islike" : 'Like'
                   };
              posts.push(obj);      
            }
             localStorage.getPosts = JSON.stringify(posts);
             posts = JSON.parse(localStorage.getPosts);
             console.log(posts);
          }
        display_data();
      });
      }



      function display_data(){

        var html = "";
         
        //console.log(user_array);
        for(var i = 0; i<users.length; i++){
          for(var j = 0; j<posts.length; j++){
            if(users[i].id == posts[j].userId){
      
              html += `<div id = "post_${posts[j].id}">
                       <p id = "user_name_${i}"><strong>Name:</strong> ${users[i].name}</p>
                       <p id = "user_post_${i}"><strong>Title: </strong> ${posts[i].title}</p>
                       <p id = "user_post_${i}"><strong>Description:</strong> ${posts[j].body}</p>
                       <button id = "like_btn_${j}"> ${posts[j]['islike']} </button>
                       <button id = "comment_btn_${j}">Comment</button>
                       <button id = "delete_btn_${j}">Delete</button>
                       </div>`
             }
          }
        }
        jQuery('#display').html(html);
      }


   //comments---------------------------------------------------
      
      jQuery(document).on('click', 'button[id^="comment_btn_"]', function(){
        var commentHtml = "";
        var tr_id = jQuery(this).attr('id').replace('comment_btn_', 'post_');
        var trr = jQuery(this).attr('id').replace('comment_btn_', '');
        var index_val = Number(trr);
        var tempId = tr_id.replace('post_', 'temp_');
        var err = jQuery('#'+ tempId).attr('id');
        if(err){
          $(".remove").remove();
        }
        else{
          for(var i = 0; i<comments.length; i++){
            if(posts[index_val].id == comments[i].postId){
              commentHtml += `<div class = "remove" id = "temp_${index_val}">
                                <p>Comment: ${comments[i].body}</p>
                                </div>`
      
            }
          }
        commentHtml += `<div id= "div_id_${index_val}">
                        <input type="text" class = "remove" id="txt_id_${index_val}" placeholder="Add comment">
                        <button class = "remove" id = "add_comment_${index_val}">Submit</button>`
        }
         jQuery('#delete_btn_'+index_val).after(commentHtml); 
      }); 



      

      //add comments-------------------------------------------

       jQuery(document).on('click','button[id^="add_comment_"]',function(){
          var add_new = "";
          var postId = $(this).attr('id').substr(12, 4);
          var postnewid = postId + 1;
          var comment_value = jQuery("#txt_id_"+ postId).val();
          if(jQuery("#txt_id_"+ postId).val() != ""){
            var entry = {
              "body" : comment_value,
              "postId" : postnewid
            };
        comments.push(entry);
        add_new += `<div class = "remove" id = "temp_${postId}">
                    <p>Comment: ${comment_value}</p>
                    </div>`

        jQuery('#div_id_'+ postId).before(add_new);
        jQuery("#txt_id_"+ postId).val("");
        
        localStorage.getComments = JSON.stringify(comments);
        }
      });





// //delete--------------------------------------------------------
jQuery(document).on('click', 'button[id^="delete_btn_"]', function(){

    var tr_id = jQuery(this).attr('id').replace('delete_btn_', 'post_');
    var trr = jQuery(this).attr('id').replace('delete_btn_', '');

    var trr_num = Number(trr);
    posts.slice(trr_num ,1);
    var index_val = trr_num  + 1;
    console.log(index_val);
    jQuery("#post_" +index_val).remove();
    localStorage.getPosts = JSON.stringify(posts);
    posts=JSON.parse(localStorage.getPosts);
    console.log(posts);
  });



//   //like-----------------------------------------------------------

  jQuery(document).on('click', 'button[id^="like_btn_"]', function(){
    var tr_id = jQuery(this).attr('id').replace('like_btn_', '');
    var trr_num = Number(tr_id);
  
    if(posts[trr_num]['islike'] != true){
      posts[trr_num]['islike'] = 'Liked';    
      $(this).html('Liked');    
      localStorage.getPosts = JSON.stringify(posts);
    }
  });