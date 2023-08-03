    var checkedcategory = [];
    var checkedtags = [];
    var lush_output_page = 1;
    var max_num_pages;
    var found_posts;
    var from_result;
    var to_result;
    let initMapLoad = (arr) => {
        // Replace YOUR_API_KEY with your Google Maps API key
        const apiKey = 'YOUR_API_KEY';

        function initMap() {
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: {
                    lat: 44.551239,
                    lng: -79.7773059
                }, // Set your desired map center
            });
            // Sample marker data representing multiple places
            const markerData = [];

            if (arr != "") {
                arr = arr;
            } else {
                arr = mdfAjex.mapDestinations;
            }

            jQuery.each(arr, function(index, val) {
                let infowindowstyle = `<div style ='max-width:300px;' ><i style='color:#027088;font-size:16px;' class='fa fa-star'> ${val.name}</i><h5>${val.title}</h5><p>${val.des}</p><a href='${val.link}'>More Details</a></div>`
                const data = {
                    id: val.postId,
                    position: {
                        lat: parseFloat(val.lat),
                        lng: parseFloat(val.lng)
                    },
                    title: val.des,
                    content: infowindowstyle, // Demo text for the info window
                };
                markerData.push(data);
            });


            const markers = markerData.map((data) => {
                const marker = new google.maps.Marker({
                    position: data.position,
                    map: map,
                    title: data.title,
                });
                // Create an info window for each marker
                const infoWindow = new google.maps.InfoWindow({
                    content: data.content
                });

                // Add a click event listener to the marker to open the info window
                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                    map.panTo(data.position);
                });

                return marker;
            });

            // Use MarkerClustererPlus to group markers and show cluster labels
            const markerCluster = new MarkerClusterer(map, markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
                gridSize: 50, // Adjust this value to control cluster size
                maxZoom: 15, // Adjust this value to control when clusters split
                styles: [{
                    height: 53,
                    url: 'https://superstorefinder.net/support/wp-content/uploads/2015/07/m4.png',
                    width: 53,
                    textColor: 'white',
                    textSize: 14,
                }, ],
            });

        }
        // Call the initMap function to initialize the map and markers
        initMap();


    }

    jQuery(document).ready(function($) {


        jQuery("#input_1_5_4").on('change', function() {

            const address = jQuery('#input_1_5_1').val();
            const city = jQuery('#input_1_5_3').val();
            const state = jQuery(this).val();

            // Make a GET request to the Google Maps Geocoding API
            jQuery.get('https://maps.googleapis.com/maps/api/geocode/json', {
                address: address + ' , ' + city + "," + state,
                key: 'AIzaSyDDd7_SkVVpT-1LQ0zWp2ZlwofOmX-33bQ' // Replace with your actual API key
            }, function(data) {
                if (data.status === 'OK' && data.results.length > 0) {
                    const location = data.results[0].geometry.location;
                    const latitude = location.lat;
                    const longitude = location.lng;
                    jQuery('#input_1_64').val(latitude);
                    jQuery('#input_1_65').val(longitude);
                    jQuery('#input_1_66').val(state);
                } else {
                    // Handle error or no results
                    jQuery('#input_1_64').val('N/A');
                    jQuery('#input_1_65').val('N/A');
                }
            });
        })


        jQuery("#single-page-tags-destination a").each(function() {
            jQuery(this).attr("href", "/member-directory/")
        })


        function checkallinputs() {
            var checkboxtrue = [];
            jQuery(".sidebar li").each(function(index, el) {
                var chekckboxlist = jQuery(this).find('input[type="checkbox"]');
                if (chekckboxlist.prop('checked')) {
                    checkboxtrue.push(true);
                } else {
                    checkboxtrue.push(false);
                }
            });
            return checkboxtrue;
        }

        function pageincrement(pagedata) {
            console.log(pagedata);
        }

        jQuery("#lush_output_next_page").on('click', function() {
            lush_output_page++;
            lush_output_next_page(this)
        })
        jQuery("#lush_output_prev_page").on('click', function() {
            lush_output_page--;
            lush_output_next_page(this)
        })

        function lush_output_prev_page(data) {
            filterdata(checkedcategory, checkedtags, lush_output_page)
        }

        function lush_output_next_page(data) {
            filterdata(checkedcategory, checkedtags, lush_output_page)
            // lush_output_set_page_for_loading();
            // lush_output_do_data_request(event, { page_increment: 1 });
        }

        initMapLoad(mdfAjex.mapDestinations);


        $(function() {
            $('div[id^=div]').hide();
            $('#div1').show();
            $('#showdiv1').click(function() {
                $('div[id^=div]').hide();
                $('#div1').show();
            });
            $('#showdiv2').click(function() {
                $('div[id^=div]').hide();
                $('#div2').show();
            });
            $('#showdiv3').click(function() {
                $('div[id^=div]').hide();
                $('#div3').show();
            });
        })

        function postloads(lush_output_page) {
            jQuery.ajax({
                url: mdfAjex.fmdajex,
                data: {
                    action: 'memberdirectoryfilter_load',
                    page: lush_output_page,
                },
                success: function(data) {
                    $(".grid-prod").html("");
                    $(".section-list table").html("");
                    $.each(data, function(index, val) {
                        max_num_pages = val.max_num_pages;
                        max_num_posts = val.found_posts;
                        var showing_results_start_count = ((lush_output_page - 1) * 9) + 1;
                        var showing_results_end_count = lush_output_page * 9;
                        showing_results_end_count = (showing_results_end_count > max_num_posts) ? max_num_posts : showing_results_end_count;

                        jQuery(".paginatin-counter").html(pagination_counter(showing_results_start_count, showing_results_end_count, max_num_posts));
                        if (lush_output_page === 1) {
                            jQuery('#lush_output_prev_page').prop('disabled', true);
                        } else {
                            jQuery('#lush_output_prev_page').prop('disabled', false);
                        }
                        if (lush_output_page === max_num_pages) {
                            jQuery('#lush_output_next_page').prop('disabled', true);
                        } else {
                            jQuery('#lush_output_next_page').prop('disabled', false);
                        }
                        if (val.post_term != null) {
                            var post_term_name = "<i class='fa fa-star'> " + val.post_term + "</i>";
                        } else {
                            var post_term_name = "";
                        }
                        var inerhtmlgrid = `<a href="${val.post_link}" class="prod-grid" target="_blank">
                  <div class="gird-tumbnail"><img src="${val.post_thumbnail}" alt=""></div><div class="grid-content">
                 <span class="destination-term">  ${post_term_name}</span>
                   <h3>${val.post_title}</h3>
                   <p class="more-details">More Details</p>
                 </div></a>`;
                        var inerhtmllist = `<tr class="post">
                  <td>  <img src="${val.post_thumbnail}" alt=""><td>
                    <td>  <span class="destination-term">  ${post_term_name}</span><h3>${val.post_title}</h3>
                      <p>${val.post_content} </p>
                      <a href="${val.post_link}" target="_blank"> More Details</a></td>
                    </tr>`;
                        $(".grid-prod").append(inerhtmlgrid);
                        $(".section-list table").append(inerhtmllist);
                    });
                },
            })
        }

        postloads(lush_output_page)

        /*Filter request */
        function filterdata(checkedcatgory = "", checkedtags = "", lush_output_page = "") {
            jQuery.ajax({
                url: mdfAjex.fmdajex,
                type: 'POST',
                data: {
                    action: 'memberdirectoryfilter_data',
                    catgory: JSON.stringify(checkedcatgory),
                    tag: JSON.stringify(checkedtags),
                    page: JSON.stringify(lush_output_page),
                },
                success: function(data) {
                    if (data != "") {
                        $(".grid-prod").html("");
                        $(".section-list table").html("");
                        var destinationarr = [];
                        $.each(data, function(index, val) {
                            max_num_pages = val.max_num_pages;
                            max_num_posts = val.found_posts;
                            var showing_results_start_count = ((lush_output_page - 1) * 9) + 1;
                            var showing_results_end_count = lush_output_page * 9;

                            showing_results_end_count = (showing_results_end_count > max_num_posts) ? max_num_posts : showing_results_end_count;
                            console.log({
                                showing_results_end_count,
                                max_num_posts
                            })
                            jQuery(".paginatin-counter").html(pagination_counter(showing_results_start_count, showing_results_end_count, max_num_posts));
                            if (lush_output_page === 1) {
                                jQuery('#lush_output_prev_page').prop('disabled', true);
                            } else {
                                jQuery('#lush_output_prev_page').prop('disabled', false);
                            }
                            if (lush_output_page === max_num_pages) {
                                jQuery('#lush_output_next_page').prop('disabled', true);
                            } else {
                                jQuery('#lush_output_next_page').prop('disabled', false);
                            }
                            if (val.post_term != null) {
                                var post_term_name = "<i class='fa fa-star'> " + val.post_term + "</i>";
                            } else {
                                var post_term_name = "";
                            }
                            if (
                                val.destinations.destinationName !== null &&
                                val.destinations.destinationLat !== null &&
                                val.destinations.destinationLng !== null
                            ) {
                                destinationarr.push({
                                    name: val.destinations.destinationName,
                                    lat: val.destinations.destinationLat,
                                    lng: val.destinations.destinationLng,
                                    des: val.destinations.des,
                                    title: val.destinations.title,
                                    link: val.destinations.link
                                });
                            }
                            var inerhtmlgrid = `<a href="${val.post_link}" class="prod-grid" target="_blank">
                  <div class="gird-tumbnail"><img src="${val.post_thumbnail}" alt=""></div><div class="grid-content">
                 <span class="destination-term">  ${post_term_name}</span>
                   <h3>${val.post_title}</h3>
                   <p class="more-details">More Details</p>
                 </div></a>`;
                            var inerhtmllist = `<tr class="post">
                  <td>  <img src="${val.post_thumbnail}" alt=""><td>
                    <td> <span class="destination-term">  ${post_term_name}</span> <h3>${val.post_title}</h3>
                      <p>${val.post_content} </p>
                      <a href="${val.post_link}"> More Details</a></td>
                    </tr>`;
                            $(".grid-prod").append(inerhtmlgrid);
                            $(".section-list table").append(inerhtmllist);
                        });
                    } else {
                        $(".grid-prod").html("");
                        $(".section-list table").html("")
                        max_num_posts = 0;
                        var showing_results_start_count = ((lush_output_page - 1) * 9) + 1;
                        var showing_results_end_count = lush_output_page * 9;
                        showing_results_end_count = (showing_results_end_count > max_num_posts) ? max_num_posts : showing_results_end_count;

                        jQuery(".paginatin-counter").html(pagination_counter(showing_results_start_count, showing_results_end_count, max_num_posts));
                    }
                    initMapLoad(destinationarr);
                }
            })
        }



        function filterNullValues(array) {
            var filteredArray = array.filter(function(value) {
                return value !== null;
            });
            return filteredArray;
        }


        jQuery(".catgory li, .destination li").each(function(index, el) {
            jQuery(this).on('click', function(e) {
                var checkbox = jQuery(this).find('input[type="checkbox"]');
                var liElement = jQuery(this);
                checkbox.prop("checked", !checkbox.prop("checked"));
                liElement.toggleClass("active");
                var value = checkbox.data('filter-cat');
                var tags = checkbox.data('filter-distination');
                if (checkbox.prop('checked')) {
                    // Checkbox is checked, add the value to the array if it's not null
                    if (value !== null && !checkedcategory.includes(value)) {
                        checkedcategory.push(value);
                    }
                    // Add tags to the checkedtags array if they are not null and not already present
                    if (tags !== null && !checkedtags.includes(tags)) {
                        checkedtags.push(tags);
                    }
                } else {
                    // Checkbox is unchecked, remove the value from the array
                    var index = checkedcategory.indexOf(value);
                    if (index !== -1) {
                        checkedcategory.splice(index, 1);
                    }
                    // Remove tags from the checkedtags array
                    if (tags !== null && checkedtags.includes(tags)) {
                        var tagIndex = checkedtags.indexOf(tags);
                        if (tagIndex !== -1) {
                            checkedtags.splice(tagIndex, 1);
                        }
                    }
                }
                lush_output_page = 1;
                setTimeout(function() {
                    filterdata(filterNullValues(checkedcategory), filterNullValues(checkedtags), lush_output_page);
                }, 300);
            });
        });
        var isMobileScreen = window.matchMedia("(max-width: 768px)").matches;
        if (isMobileScreen) {
            $(".sidebar").hide();
            // Bind a click event to the button
            $("#filtertoggleButton, #filtertoggleButtonSidebar").click(function() {
                // Toggle the visibility of the element
                $(".sidebar").toggle();
            });
        }
        jQuery(".buttons span").each(function() {
            jQuery(this).on('click', function() {
                jQuery(".buttons span").removeClass("active")
                jQuery(this).addClass("active");
            })
        })



        function pagination_counter(from_result, to_result, max_num_pages) {
            var html = `Showing ${from_result}-${to_result} of ${max_num_pages} results`;
            return html;
        }



    });
