var app = angular.module('ecommerce',["ngRoute","toaster"]);


app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller:"productController"
    })
    .when("/products", {
        templateUrl : "home.html"
    })
    .when("/products/:id", {
        templateUrl : "product_detail.html",
        controller:"getProductController"
    })
    .when("/login", {
        templateUrl : "login.html",
        controller:"loginController"
    })
    .when("/cart", {
        templateUrl : "cart.html",
        controller:'cartController'
    })
    .when("/feedback",{
        templateUrl:"feedback.html",
        controller:"feedbackController"
    })
    .when("/upload_images/:id",{
        templateUrl:"seller.html",
        controller:"sellerController"
    })
    .when("/sell_product",{
        templateUrl:"sell_product.html",
        controller:"sellProductController"
    })
    .when("/seller",{
        templateUrl:"seller_home.html",
        controller:"sellerHomeController"
    })
    .when("/modifyproduct/:id",{
        templateUrl:"sell_product.html",
        controller:"modifyProductController"
    })
    .when("/tags",{
        templateUrl:"sell_product_tag.html",
        controller:"productTagController"
    })
});

var token;

app.factory('Session', function($window) {
    var localStorage = $window.localStorage;
    
    var Session = {
      getItem: function(key) {
        return angular.fromJson(localStorage.getItem(key));
      },
      setItem: function(key, value) {
        return localStorage.setItem(key, angular.toJson(value));
      },
      removeItem: function(key) {
        return localStorage.removeItem(key);
      }
    };

    return Session;
  });

app.service('UserService',function($http,$window,Session){
    var token;
    const headers= {'Authorization':'Token'}

    this.loginUser = function(username,password){
        var data = {
            username:username,
            password:password
        }

        $http.post("http://127.0.0.1:8000/auth/login/",JSON.stringify(data),headers).then(function(response){
            if(response.data){
                console.log(response.data)
                var responsedata=  response.data
                token = responsedata.token
                console.log(token);
                Session.setItem("token",token)
                console.log(Session.getItem('token'))

                $http.get("http://127.0.0.1:8000/auth/get_user/"+token).then(function(response){
                var user = response.data    
                Session.setItem("user",user)
                $window.location.reload()
                })

                return true
            }
            else{
                return false
            }
        },function(response){
            return false
        })
    }

    this.getToken = function(){
        return this.token
    }
})


app.service('imageService', ['$http', function ($http,$scope) {
    var imageService = this

    this.uploadUrl = "http://127.0.0.1:8000/images/"

    imageService.getImages = function(scope,product){
        this.response = []
        $http.get(this.uploadUrl+'product/'+product).then(function(response){
            scope.images = response.data
            console.log(response.data)
        })
    }

    imageService.deleteImage = function(scope,image,product){
        console.log(image)
        $http.delete("http://127.0.0.1:8000/images/delete/"+image.id).then(function(response){
            imageService.getImages(scope,product)
            scope.message = "Image removed successfully"
        })
    }

    imageService.uploadFileToUrl = function(scope,file,product){
        var fd = new FormData();
        fd.append('image', file);
        fd.append('product',product)
        $http.post(this.uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined} 
        }) 
        .success(function(){ 
            scope.message = "Image added successfully"
            imageService.getImages(scope,product)
        }) 
        .error(function(){ 
            scope.message = "oops.."
        }); 
    } 
}]);

app.service('productService',function($window,$http,Session){
    var productService = this
    
    productService.deleteProduct = function(scope,id){
        var user = Session.getItem('user')
        var token = Session.getItem('token')
        const headers = {'Authorization':'Token '+token,'Content-Type':undefined}
        console.log(user.user)

        var data =new FormData();
        data.append('owner',user.user)

        $http.delete("http://127.0.0.1:8000/products/"+id,{
            transformRequest: angular.identity,
            headers: headers 
        }).then(function(response){ 
            console.log(response.data)
            $window.location.href = '#'
        },function(response){ 
            scope.message = "oops.."
            $window.alert(response)
        }); 
    }

    productService.modifyProduct = function(scope,id,name,price,desc,thumbnail){
        var user = Session.getItem('user')
        var token = Session.getItem('token')
        const headers = {'Authorization':'Token '+token,'Content-Type':undefined}
        console.log(user.user)

        var data =new FormData();
        data.append('owner',user.user)
        data.append('name',name)
        data.append('price',price)
        data.append('description',desc)
        data.append('thumb_nail',thumbnail)

        $http.put("http://127.0.0.1:8000/products/"+id,data,{
            transformRequest: angular.identity,
            headers: headers 
        }).then(function(response){ 
            console.log(response.data)
            $window.location.href = '#products/'+response.data.id
        },function(response){ 
            scope.message = "oops.."
            $window.alert(response)
        }); 
    }

    productService.addProduct = function(scope,name,price,desc,thumbnail){

        var user = Session.getItem('user')
        var token = Session.getItem('token')
        const headers = {'Authorization':'Token '+token,'Content-Type':undefined}
        console.log(user.user)

        var data =new FormData();
        data.append('owner',user.user)
        data.append('name',name)
        data.append('price',price)
        data.append('description',desc)
        data.append('thumb_nail',thumbnail)

        $http.post("http://127.0.0.1:8000/products/",data,{
            transformRequest: angular.identity,
            headers: headers 
        }).then(function(response){ 
            console.log(response.data)
            $window.location.href = '#upload_images/'+response.data.id
        },function(response){ 
            scope.message = "oops.."
            $window.alert(response)
        }); 

       
        
    }
})

app.service('cartService',function($http,Session){
    this.getCartItems = function(){
        var user = Session.getItem('user')
        
        $http.get("http://127.0.0.1:8000/cart/"+user.user).then(function(response){
            this.cart_items = response.data
            return this.cart_items
        })
    }

    this.isInCart = function(product_id){
        var user = Session.getItem('user')
        var result = false
        $http.get("http://127.0.0.1:8000/cart/"+user.user).then(function(response){
            var cart_items = response.data
            console.log(cart_items)
            cart_items.forEach(element => {
                console.log(element.product)
                if(element.product == product_id){
                    result = true
                }
            })
            result = false
        })
        return result
    }
})


app.controller('getProductController',function($scope,$http,$routeParams,$window,Session,productService,imageService){

    var id = $routeParams.id;
    var user = Session.getItem('user');
    $scope.current_index = 0;
    $scope.right_fill = "-fill";
    $scope.left_fill = "";
    

    $http.get("http://127.0.0.1:8000/products/"+id).then(function(response){
        var product = response.data
        $scope.product = product

        if(user == undefined){
            $scope.isOwner = false
            $scope.isNotOwner = true
        }
        else if(product.owner == user.user){
            $scope.isOwner = true
            $scope.isNotOwner = false
        }else{
            $scope.isOwner = false
            $scope.isNotOwner = true
        }

        $http.get("http://127.0.0.1:8000/images/"+'product/'+id).then(function(response){
            var images = response.data
            var product_images = []

            product_images.push(product.thumb_nail)
            images.forEach(row=>{
                product_images.push(row.image)
            })

            $scope.thumbnail = product_images[0]
            $scope.product_images = product_images

            if($scope.product_images.length == 1){
                $scope.left_fill = ""
                $scope.right_fill = ""
            }
        })

        
    })

    $scope.next = function(){
        var total_length = $scope.product_images.length
        if($scope.current_index < total_length-1){   
            $scope.current_index +=1
            
            $scope.thumbnail = $scope.product_images[$scope.current_index]
        }

        if($scope.current_index == total_length-1){
            $scope.right_fill = "";
        }
        if($scope.current_index>0){
            $scope.left_fill = "-fill";
        }
         
    }

    $scope.prev = function(){
        var total_length = $scope.product_images.length
        if($scope.current_index > 0){  
            $scope.current_index -=1
            $scope.thumbnail = $scope.product_images[$scope.current_index]
        }

        if($scope.current_index == 0){
            $scope.left_fill = "";
        }
        if($scope.current_index<total_length-1){
            $scope.right_fill = "-fill";
        }
    }

    $scope.deleteProduct = function(product_id){
       productService.deleteProduct($scope,product_id)
    }

    $scope.addToCart = function(product_id){

        var user = Session.getItem('user')
        if(user==null){
            $window.alert("You must log in to add product to cart")
        }
        var token = Session.getItem('token')
        const headers = {'Authorization':'Token '+token}
        var product = product_id
        var user_id = user.user

        var data = {
            'product':product,
            'user':user_id,
            'quantity':1
        }

        $http.post("http://127.0.0.1:8000/cart/products/",JSON.stringify(data),{'headers':headers}).then(function(response){
            console.log(response.data)
            if(response.data.detail != undefined){
                $scope.message = "Product already in cart"
            }else{
                $scope.message = "Product added to cart"
            }
        })

    }

})

app.controller('productController',function($scope,$http,Session){  
    showSlides();
    $http.get("http://127.0.0.1:8000/products")
    .then(function(response) {
      $scope.products = response.data;
      console.log($scope.products)
    });

    $http.get("http://127.0.0.1:8000/images/global/").then(function(response){
        $scope.globe_images = response.data
        console.log($scope.globe_images[0].image);
    })


    $scope.justPostIt = function(){
        var name = $scope.product_name
        var price = $scope.product_price
        var rating = $scope.product_rating
        var rating_count = $scope.product_rating_count

        var new_product = {
            'name':name,
            'price':price,
            'rating':rating,
            'rating_count':rating_count
        }

        $http.post("http://127.0.0.1:8000/products/",JSON.stringify(new_product)).then(function(response){
            if(response.data){
                console.log(response.data)
            }
            else{
                console.log("error")
            }
        },
        function (response){
            console.log(response.data);
        })
    }
});

app.controller('cartController',function($scope,$http,$window,Session,toaster){

    var user = Session.getItem('user')
    if(user == null){
        $scope.mainview = false
        $scope.secondaryview = true
        return
    }else{
        $scope.mainview = true
        $scope.secondaryview = false

    }

    $http.get("http://127.0.0.1:8000/cart/products/"+user.user).then(function(response){
        console.log(response.data)
        $scope.cart_items = response.data
    })

    $scope.incrementQuantity = function(item){
        item.quantity +=1;
    }

    $scope.decrementQuantity = function(item){
        if(item.quantity>0){
            item.quantity -=1;
        }
    }

    $scope.removeItem = function(item){
        item.prompt = true
    }

    $scope.cancel = function(item){
        item.prompt = false
    }

    $scope.proceed = function(item){

        var token = Session.getItem("token")

        const headers = {
            Authorization:`Token ${token}`
        } 

        $http.delete("http://127.0.0.1:8000/cart/delete/"+item.id,{headers:headers}).then(function(response){
            console.log(response.data)
            item.prompt = false
            $window.location.reload()
        })
    }

    $scope.modifyQuantity = function(item){
        if(item == undefined){
            return
        }

        var token = Session.getItem("token")

        var data = {
            'user':item.user,
            'product':item.product,
            'quantity':item.quantity
        }

        const headers = {
            Authorization:`Token ${token}`
        } 

        $http.put("http://127.0.0.1:8000/cart/update/"+item.id,JSON.stringify(item),{headers:headers}).then(function(response){
            $scope.message = "Quantity Modified"

            toaster.success('Title', 'Message');

         var setMessage = function(message){
            $scope.message = message
         }

            setTimeout(function(){
                setMessage("")
                $scope.$apply()
            },3000)

        })
    }

})

app.controller('loginController',function($scope,$http,$window,UserService,Session){
    var user = Session.getItem('user')
    if(user != null){
        $window.location.href = "#"
    }



    $scope.loginUser = function(){
        var username = $scope.username;
        var password = $scope.password;
        
        UserService.loginUser(username,password)

    }
})

app.controller('feedbackController',function($scope,$http){

    $scope.resetForm = function(){
        $scope.name = "";
        $scope.email ="";
        $scope.subject = "";
        $scope.content = "";
    }

    $scope.sendFeedBack = function(){
        var name = $scope.name;
        var email = $scope.email;
        var subject = $scope.subject;
        var content = $scope.content;

        data = {
            'name':name,
            'email':email,
            'subject':subject,
            'content':content
        }
        
        $http.post("http://127.0.0.1:8000/auth/feedback/",JSON.stringify(data)).then(function (response){
            if(response.data){
                console.log(response.data)
                $scope.resetForm();
                $scope.return_message = "Thanks "+ name+" We have received your feedback";
            }
            else{
                $scope.return_message = "Thanks "+ name+" We have received your feedback";
            }
            return response
        },
        function (response){
            $scope.return_message = "Invalid Details"
        })

    }
})

app.controller('sellerController',function($scope,$window,$http,$routeParams,imageService,Session){


    var id = $routeParams.id;
    
    $scope.returnHome = function(){
        $window.location.href = "#"
    }


    $http.get("http://127.0.0.1:8000/products/"+id).then(function(response){
        var product = response.data
        var user = Session.getItem('user')
        if(product.owner==user.user){
            $scope.main_view = true
            $scope.secondary_view = false
            $scope.product_name = response.data.name
        } else{
            $scope.main_view = false
            $scope.secondary_view =true
        }
    })

    $scope.images = []
    
    $scope.images = imageService.getImages($scope,id)
    console.log($scope.images)
    $scope.uploadImage = function(){

        var image = $scope.upload_image

        imageService.uploadFileToUrl($scope,image,id)

    }

    $scope.deleteImage = function(image){
        imageService.deleteImage($scope,image,id)
    }
})

app.controller('modifyProductController',function($scope,$http,$routeParams,productService,Session){
    $scope.button = "Modify"
    
    var user = Session.getItem('user')
    if(user==null){
        $scope.main_view =false
        $scope.secondary_view=true
        $scope.message = "Login to continue"
        return
    }
    
    var id = $routeParams.id;
    
    $http.get("http://127.0.0.1:8000/products/"+id).then(function(response){
        var product = response.data
        if(product.owner == user.user){
            $scope.main_view = true

            $scope.name = product.name
            $scope.desc = product.description
            $scope.price = product.price

        }
        else{
            $scope.secondary_view = true
            $scope.main_view = false
            $scope.message = "404 Not Found"
        }

    },function(response){
        $scope.main_view = false
        $scope.secondary_view = true
        $scope.message = "404 Not Found"
    })

    $scope.addProduct = function(){
        var name = $scope.name
        var price = $scope.price
        var desc = $scope.desc
        var thumbnail = $scope.thumbnail

        productService.modifyProduct($scope,id,name,price,desc,thumbnail)  

    }

    $scope.main_view=true
})

app.controller('sellProductController',function($scope,$http,productService,Session){
    $scope.button = "Next"
    var user = Session.getItem('user')
    if(user==null){
        $scope.main_view =false
        $scope.secondary_view=true
        return
    }

    $scope.main_view=true
    $scope.addProduct = function(){
        var name = $scope.name
        var price = $scope.price
        var desc = $scope.desc
        var thumbnail = $scope.thumbnail

        productService.addProduct($scope,name,price,desc,thumbnail)  

    }


})

app.controller("sellerHomeController",function($scope,$http,Session){
    var user = Session.getItem('user')
    if(user == null){
        $scope.message = "Login to view your projects"
        return
    }else{
        $scope.message = ""
    }

    var token = Session.getItem("token")
    const headers = {
            Authorization:`Token ${token}`
        } 

    $http.get("http://127.0.0.1:8000/auth/products/"+user.user,{headers:headers}).then(function(response){
        $scope.products = response.data
        if(Object.keys(response.data)==0){
            $scope.message = "You don't have any products"
        }
    })
})

app.directive('fileModel', ['$parse', function ($parse) { 
    return { 
        restrict: 'A', 
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel); 
            var modelSetter = model.assign;
            element.bind('change', function(){ 
                scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
                }); 
            }); 
        } 
    }; 
}]);

app.controller('indexController',function($scope,$window,Session){
    var user = Session.getItem('user')
    
    if(user != null){
        $scope.userlogged = true
        $scope.usernotlogged = false
        $scope.user_name = user.user_name
    }else{
        
        $scope.userlogged = false
        $scope.usernotlogged = true
    }

    $scope.logout = function(){
        Session.removeItem('token')
        Session.removeItem('user')
        $window.location.reload()
    }
})

app.controller("productTagController",function($scope){
    $scope.tags = ["Website","Cloud","Software"];
    var selected_tags = ["Cloud"];
    $scope.isSelected = function(tag){

        if(selected_tags.includes(tag)){
            return "selected"
        }
    }

    $scope.chipClick = function(tag){
        if(!selected_tags.includes(tag)){
            selected_tags.push(tag)
        }else{
            const index = selected_tags.indexOf(tag);
            if(index>-1){
                selected_tags.splice(index,1);
            }

        }
    }
})



var slideIndex = 0;
showSlides = function(){
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 4000);
}
