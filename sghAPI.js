//http://www.sunglasshut.com/webapp/wcs/stores/servlet/GetCatalogEntryDetailsByID?catalogId=10101&langId=-1&storeId=10152&productId=80528900478


(function() {
    
        function loadSentient() {
            console.log('loadSentient()');
            var catId = 'outstock'
            var Sentient = window['Sentient'];
            var SentientCustomerUserSessionId = '';
            var addToCart = function (product, options, quantity) {
                var id = product.spid
                console.log('product.' + product.spid)
               // console.log('addToCart ' + catId)
               // console.log('STOCK: '+catId)
                var promise = new Promise(function(resolve, reject) {
                    if (catId != 'outstock'){
                        var a = catId
                        categoryDisplayJS.storeId = constants.ajaxParams.storeId, categoryDisplayJS.langId = constants.ajaxParams.langId, 
                        categoryDisplayJS.catalogId = constants.ajaxParams.catalogId, ServicesDeclarationJS.catentryId = a, 
                        categoryDisplayJS.AddItem2ShopCartAjax(a, 1);

                        $(document).ajaxSend(function( AjaxOrderChangeServiceItemAdd, xhr, settings ) {
                          //  console.log('url: '+settings.url)
                           // console.log('successHandler: '+settings.data)
                            if (settings.data.includes("orderItemId")){
                                window.location.href='/OrderCalculate?calculationUsageId=-1&updatePrices=1&catalogId=10101&errorViewName=AjaxOrderItemDisplayView&orderId=.&langId=-1&storeId=10152&URL=AjaxOrderItemDisplayView'
                               // console.log('orderItemId');
                            }
                            //console.log('settings '+ settings.url );
                        });
                       
                        console.log(" id:"+ id)
                        resolve(id)    
                    }else{
                        reject('Product is Out Of Stock')
                    }
                    
                })
                return promise
            };
            var goToCart = function () {
                var closeExperience = false;
                window.location.href='/OrderCalculate?calculationUsageId=-1&updatePrices=1&catalogId=10101&errorViewName=AjaxOrderItemDisplayView&orderId=.&langId=-1&storeId=10152&URL=AjaxOrderItemDisplayView'
                console.log('closeExperience ' + catId)
                return closeExperience;
            };
            var getDetails = function (product, options) {
                if (options != null) {
                    var api = '/webapp/wcs/stores/servlet/GetCatalogEntryDetailsByID?catalogId=10101&langId=-1&storeId=10152&productId='
                    var id = product.spid
                   // console.log('api: '+api)
                    var promise = new Promise(function(resolve, reject) {
                        $('.ajax-loader-wrap, #ajax-container').hide();
                        window.jQuery.ajax(api+id, {
                            success: function(data) {
                                var b = data.trim().replace("/*", "");
                                b = b.replace("*/", "");
                                var json = JSON.parse(b);
                                var frameStyle = ''
                                var size = ''
                                var lensColor = ''
                                var faceShape = ''
                                var faceShapeArray = ''
                                var rating = ''
                                var frameSize = ''
                                var polarized = ''
                                var frameMaterial = ''
                                var frameColor = ''
                                var description = json.catalogEntry.description[0].longDescription
                                var attribute = json.catalogEntryAttributes.attributes
                                if (json.catalogEntry.inStock === true) {
                                    catId = json.catalogEntry.catalogEntryIdentifier.uniqueID
                                }else{
                                    catId = 'outstock'
                                }
                                for (i = 0; i < attribute.length; i++) { 
                                    var name = attribute[i].name
                                    if ( name === 'Styles' ){
                                        frameStyle = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Rating' ){
                                        rating = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Secondary Frame Size' ){
                                        frameSize = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Size' ){
                                        size = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Lens Color' ){
                                        lensColor = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Frame Color' ){
                                        frameColor = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Frame Material' ){
                                        frameMaterial = json.catalogEntryAttributes.attributes[i].value.value
                                    }
                                    if ( name === 'Polarized Lens' ){
                                        polarized = json.catalogEntryAttributes.attributes[i].value.value
                                        if (polarized === 'Polarized Lens' ){
                                            polarized = '<li><span>'+polarized+'</span></li>'
                                        }else{
                                            polarized = ''
                                        }
                                    }
                                    if ( name === 'Face Shape' ){
                                        faceShape = json.catalogEntryAttributes.attributes[i].values
                                        console.log('faceShapeArray '+faceShape.length)
                                        faceShape = getFaceShapeArray(faceShape)
                                    }
                                    //console.log('attr '+ name);
                                }
                                description =   '<ul>'+
                                                polarized+
                                                '<li><span>Frame Style: </span> '+frameStyle+'</li>'+
                                                '<li><span>Lens Color: </span> '+lensColor+'</li>'+
                                                '<li><span>Frame Color: </span> '+frameColor+'</li>'+
                                                '<li><span>Fit: </span> '+size+'</li>'+
                                                '<li><span>Size/Bridge/Temple Size: </span> '+frameSize+'</li>'+
                                                '<li><span>Frame Material: </span> '+frameMaterial+'</li>'+
                                                '<li><span>Looks Best on These Face Shapes: </span> '+faceShape+'</li>'+
                                                '</ul>'+
                                                '<p>'+description+'</p>'
                                
                         
                                resolve({
                                    price: '$'+product['sale_price'],
                                    productName: product['product_id'],
                                    productMake: product['brand'],
                                    averageRating: rating,
                                    productDescription: description,
                                    originalPrice: product['sale_price'] === product['price'] ? '' : product['price']
                                });
                            },
                            complete: function(){
                                $('.ajax-loader-wrap, #ajax-container').show();
                            },
                            error: function() {
                                reject('Something went wrong');
                                console.log( "error");
                            }
                        })
                    });
                    return promise
                    
                }else if (options) {
                   // console.log('options product : '+JSON.stringify(product))
                   // console.log('options options : '+JSON.stringify(options))
                    var price = options.width === 'N' ? '$70' : '$80';
                    return Promise.resolve({
                        price: price,
                        productName: 'Example Glasses',
                        productMake: 'Rayban',
                        averageRating: '4',
                        percentOff: '10%',
                        originalPrice: '$60',
                        promotionalText: 'Ships Free',
                        productDescription: 'Description of the glasses'
                    });
                } else {
                      //  console.log('getDetails product : '+JSON.stringify(product))
                       // console.log('getDetails options : '+JSON.stringify(options))
                        return Promise.resolve({
                        price: '$'+product['sale_price'],
                        productName: product['product_id'],
                        productMake: product['brand'],
                        averageRating: product['Product_Review_Average'],
                        promotionalText: 'ALWAYS FREE 2-DAY SHIPPING & RETURNS',
                        originalPrice: product['sale_price'] === product['price'] ? '' : product['price']
                    });
                }
                
            };
            var getHeroImages = function (product, options) {
               // console.log('getDetails product : '+JSON.stringify(product))
               // console.log('getDetails options : '+JSON.stringify(options))
                var id = product.spid  
                return Promise.resolve([{
                        mainImage: 'http://s7d3.scene7.com/is/image/LuxotticaRetail/'+product.spid+'_shad_fr?$pdpSet$',
                        thumbnailImage: 'http://s7d3.scene7.com/is/image/LuxotticaRetail/'+product.spid+'_shad_fr?$jpegdefault$&wid=400',

                    },
                    {
                        mainImage: 'http://s7d3.scene7.com/is/image/LuxotticaRetail/'+product.spid+'_shad_qt?$pdpSet$',
                        thumbnailImage: 'http://s7d3.scene7.com/is/image/LuxotticaRetail/'+product.spid+'_shad_qt?$jpegdefault$&wid=400',
                        
                    },
                    {
                        mainImage: 'http://s7d3.scene7.com/is/image/LuxotticaRetail/'+product.spid+'_090A?$pdpSet$',
                        thumbnailImage: 'http://s7d3.scene7.com/is/image/LuxotticaRetail/'+product.spid+'_090A?$jpegdefault$&wid=400',
                        
                    }
                    ]);
            };
            var getProductOptions = function (product, options) {
                // console.log('product String: '+JSON.stringify(product))
                // console.log('options String: '+JSON.stringify(options))
                var api = '/webapp/wcs/stores/servlet/GetCatalogEntryDetailsByID?catalogId=10101&langId=-1&storeId=10152&productId='
                var id = product.spid 
                //console.log('product: '+product.spid)
                var promise = new Promise(function(resolve, reject) {
                        resolve([])
                });
                return promise
            };

            function getFaceShapeArray(e) {
                    var eArray = []
                   e.forEach(function(g) {
                        eArray.push(' '+g.value)
                       // console.log('forEach '+ g.value );
                   })
                    //console.log('getFaceShapeArray '+ e.length );
                    var faceshape = eArray.toString();
                   // console.log('getFaceShapeArray '+ faceshape );
                    return faceshape
              }

            var basicConfig = {
                customerUserSessionId: SentientCustomerUserSessionId
            };
            var functionConfigurations = {
                addToCart: addToCart,
                //goToCart: goToCart,
                // feedbackSent, Not implementing feedback
                getDetails: getDetails,
                // getReviews, Not implementing reviews
                getHeroImages: getHeroImages,
                getProductOptions: getProductOptions
            };
            Sentient.init(basicConfig, functionConfigurations, {
                noIframe: true,
                fields: ['sale_price', 'title', 'brand', 'price', 'product_id'],
                useDomainForCookies: true,
                disableQuantitySelector:true,
                strictMode: false
            }).then(function () {
                console.info('LOADED');
            }).catch(function (e) {
                console.error(e);
            });

        }
        function setSeeds() {
            var pageType = utag.data.page_type
            if(pageType == 'Search' || pageType == 'Catalog'){
                $('.item.sentient-badge .compare')
                    .text('SEE SIMILAR STYLES')
                    .addClass('style-finder finder-seeded')
                    .append('<svg class="open-modal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0.3 20 20"><path d="M16.3 2.2L9 9.5c-.4.4-.4 1.1 0 1.5.4.4 1.1.4 1.5 0l7.2-7.2v2.4c0 .5.4 1 1 1 .5 0 1-.4 1-1v-5c0-.3-.1-.5-.3-.7-.2-.2-.4-.3-.7-.3h-5c-.5 0-1 .4-1 1 0 .5.4 1 1 1h2.6zm3.5 15.4c0 1.4-1 2.5-2.2 2.5H2.1C.9 20.1-.1 19-.1 17.6V2.7C-.1 1.3.9.2 2.1.2h5.8c.5 0 1 .4 1 1s-.4 1-1 1H2.5c-.3 0-.6.3-.6.7v14.6c0 .4.3.7.6.7h14.7c.3 0 .6-.3.6-.7v-5.3c0-.5.4-1 1-1s1 .4 1 1"/></svg>')
                    .removeAttr('href')
                    .removeAttr('onclick')
                    .show()

                $('.sentient-badge a.finder-seeded').on('click', function() {
                    var $parent = $(this).closest('.thumbnailWrap')
                    var upc = String($parent.data('upc'));
                    Sentient.show(upc, 'sunglasses');
                    $.cookie("sentientSeed", "plp", {expires: 20, path: '/', domain: 'sunglasshut.com'});
                   // console.log('upc '+upc);
                })
            }
            if(pageType == 'Product' && $('#pdp.sentient-badge').length){
                $('#pdp.sentient-badge #breadCrumbResults').html('')
                $(
                    $('<a/>')
                        .addClass('style-finder finder-seeded')
                        .text('SEE SIMILAR STYLES')
                        .append('<svg class="open-modal-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0.3 20 20"><path d="M16.3 2.2L9 9.5c-.4.4-.4 1.1 0 1.5.4.4 1.1.4 1.5 0l7.2-7.2v2.4c0 .5.4 1 1 1 .5 0 1-.4 1-1v-5c0-.3-.1-.5-.3-.7-.2-.2-.4-.3-.7-.3h-5c-.5 0-1 .4-1 1 0 .5.4 1 1 1h2.6zm3.5 15.4c0 1.4-1 2.5-2.2 2.5H2.1C.9 20.1-.1 19-.1 17.6V2.7C-.1 1.3.9.2 2.1.2h5.8c.5 0 1 .4 1 1s-.4 1-1 1H2.5c-.3 0-.6.3-.6.7v14.6c0 .4.3.7.6.7h14.7c.3 0 .6-.3.6-.7v-5.3c0-.5.4-1 1-1s1 .4 1 1"/></svg>')
                        ).appendTo('#pdp.sentient-badge #breadCrumbResults')

                $('.sentient-badge a.finder-seeded').on('click', function() {
                    var upc = String($('#pdp .upc').text());
                    Sentient.show(upc, 'sunglasses');
                    $.cookie("sentientSeed", "pdp", {expires: 20, path: '/', domain: 'sunglasshut.com'});
                    console.log('upc '+upc);
                })
                console.log('Product');
            }

            


        }

        function sentientScript() {
            var url = '//static.sentientawareapi.com/sunglass-hut/sentient-bootstrapper.min.js'
            $('.item.sentient-badge .compare').text('')
            $('.ajax-loader-wrap, #ajax-container').hide();
            window.jQuery.ajax(url, {
                    type: 'get',
                    dataType: 'script',
                    async: true,
                    crossDomain: true,
                    success: function(data) {
                        setSeeds()
                        loadSentient()
                        
                        console.log('sentientawareapi.com' );
                    },
                    complete: function(){
                        $('.ajax-loader-wrap, #ajax-container').show();
                    },
                    error: function() {
                      console.log( "error");
                    }
                })
        }
    sentientScript();
})()


