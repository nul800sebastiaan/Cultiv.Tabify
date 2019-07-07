angular.module("umbraco")
    .controller("Cultiv.Tabify", function ($element) {

        // From: https://nathanw.com.au/post/replacing-interceptors-with-directive-injection/
        var contentForm = angular.element($element.closest('[name="contentForm"]'));

        var panes;
        var umbGroupPanelClass = ".umb-group-panel";

        // We need to wait until the panels exist in the dom
        waitUntil(function () {
            return $(umbGroupPanelClass).length > 0;
        }, function () {
            // The panels exist now, go!
            panes = angular.element(contentForm.find(umbGroupPanelClass));

            // Build the tabs list
            var tabsElement;
            var tabsList = "<ul id=\"tabsList\">";
            angular.forEach(panes, function (value, key) {
                var buttonClass = "tabLink";
                if (key === 0) {
                    // If it's the first tab set it to active
                    buttonClass = buttonClass + " active";

                    // We want to insert the tab buttons before the first group
                    tabsElement = value.parentElement;
                } else {
                    // If it's not the first group, then hide it
                    $(value).attr("style", "display: none");
                }

                // Add a unique id to the group so we can easily target it later
                $(value).attr("id", "tab-" + key);
                // Get the group title from the group
                var title = $(value)[0].children[0].children[0].innerHTML;

                // Build the tab element with the unique id to target when clicked
                tabsList = tabsList + "<li class=\"" + buttonClass + "\" data-id=\"tab-" + key + "\">" + title + "</li>";
            });
            tabsList = tabsList + "</ul>";
            $(tabsList).insertBefore(tabsElement);

            // Add a click handler to all the new tab links we just inserted
            var tabLinkClassName = document.getElementsByClassName("tabLink");
            for (var i = 0; i < tabLinkClassName.length; i++) {
                tabLinkClassName[i].addEventListener("click", function (event) {
                    var attribute = this.getAttribute("data-id");
                    showTab(event, attribute);
                });
            }
        }, function () {
            console.log("Not waiting any longer for " + umbGroupPanelClass + " to come into existence");
        });

        var umbSubViewsNavClass = ".umb-sub-views-nav";
        // Wait until all of the content apps are availeble in the .umb-sub-views-nav container
        waitUntil(function () {
            return $(umbSubViewsNavClass).length > 0;
        }, function () {
            // The Tabify content app is empty, remove it
            var tabifyAppLink = angular.element(contentForm.find('[data-element="sub-view-cultivTabify"]'));
            var tabifyApp = tabifyAppLink[0].parentElement.parentElement.parentElement;
            $(tabifyApp).remove();

            // The dropdown for the content groups on the content app doesn't work any more, delete it
            var contentAppLink = angular.element(contentForm.find('[data-element="sub-view-umbContent"]'));
            var contentAppDropdown = contentAppLink[0].parentElement.getElementsByTagName("ul")[0];
            $(contentAppDropdown).remove();
        }, function () {
            console.log("Not waiting any longer for " + umbSubViewsNavClass + " to come into existence");
        });

        // From: https://stackoverflow.com/a/34002258
        function waitUntil(isReady, success, error, count, interval) {
            if (count === undefined) {
                count = 1000;
            }
            if (interval === undefined) {
                interval = 100;
            }
            if (isReady()) {
                success();
                return;
            }
            // The call back isn't ready. We need to wait for it
            setTimeout(function () {
                if (!count) {
                    // We have run out of retries
                    if (error !== undefined) {
                        error();
                    }
                } else {
                    // Try again
                    waitUntil(isReady, success, error, count - 1, interval);
                }
            }, interval);
        }

        // From: https://www.w3schools.com/howto/howto_js_tabs.asp
        function showTab(evt, tabId) {
            // Declare all variables
            var i, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("umb-group-panel");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            // Get all elements with class="tablinks" and remove the class "active"
            tablinks = document.getElementsByClassName("tabLink");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }

            // Show the current tab, and add an "active" class to the button that opened the tab
            document.getElementById(tabId).style.display = "block";
            evt.currentTarget.className += " active";
        }
    });