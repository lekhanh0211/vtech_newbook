﻿'use strict';
var app = angular.module('uiApp');

app.controller('HTMenuCtrl', ['$scope', '$resource', 'svMenu', 'ngProgress', 'toaster'
    , function myFnc($scope, $resource, svMenu, ngProgress, toaster) {
        $scope.DsMenu = [];
        $scope.IsMaster = true;
        $scope.IsCreate = true;
        $scope.Menu = {};
        $scope.iPageSize = '10';

        $scope.refreshData = function (pageIndex) {
            ngProgress.start();
            $scope.pageIndex = pageIndex;

            svMenu.query({}).$promise.then(function (d) {
                $scope.DsMenu = d;
                ngProgress.complete();
            }, function (err) {
                ngProgress.complete();
            });
        };

        $scope.updateOrCreate = function () {
            svMenu.createOrUpdate($scope.Menu).$promise.then(function (d) {
                console.log('Thành công');
                $scope.IsMaster = true;
                $scope.refreshData();
            }, function (err) {
                console.log('Thất bại');
            });
        };

        $scope.goToDetail = function (isCreate, obj) {
            $scope.Menu = {};

            $scope.IsMaster = false;
            $scope.IsCreate = isCreate;
            if (!isCreate) {
                $scope.Menu = obj;
            }
        };

        $scope.exitDetail = function () {
            $scope.IsMaster = true;
        };

        $scope.delete = function (id) {
            svMenu.delete(id).$promise.then(function (d) {
                toaster.success("Xóa menu thành công!");
                $scope.refreshData();
            }, function (err) {
                toaster.error("Xóa menu thất bại!");
            });
        };

        $scope.refreshData(1);
        $scope.isSearch = false;

        $scope.focusin = function () {
            $scope.isSearch = true;
        };
        $scope.focusout = function () {
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.isSearch = false;
                });
            }, 500);
        };
        $scope.DsICon = [{ val: 'fa-glass' }, { val: 'fa-music' }, { val: 'fa-search' }, { val: 'fa-envelope-o' }, { val: 'fa-heart' }, { val: 'fa-star' }, { val: 'fa-star-o' }, { val: 'fa-user' }, { val: 'fa-film' }, { val: 'fa-th-large' }, { val: 'fa-th' }, { val: 'fa-th-list' }, { val: 'fa-check' }, { val: 'fa-remove' }, { val: 'fa-close' }, { val: 'fa-times' }, { val: 'fa-search-plus' }, { val: 'fa-search-minus' }, { val: 'fa-power-off' }, { val: 'fa-signal' }, { val: 'fa-gear' }, { val: 'fa-cog' }, { val: 'fa-trash-o' }, { val: 'fa-home' }, { val: 'fa-file-o' }, { val: 'fa-clock-o' }, { val: 'fa-road' }, { val: 'fa-download' }, { val: 'fa-arrow-circle-o-down' }, { val: 'fa-arrow-circle-o-up' }, { val: 'fa-inbox' }, { val: 'fa-play-circle-o' }, { val: 'fa-rotate-right' }, { val: 'fa-repeat' }, { val: 'fa-refresh' }, { val: 'fa-list-alt' }, { val: 'fa-lock' }, { val: 'fa-flag' }, { val: 'fa-headphones' }, { val: 'fa-volume-off' }, { val: 'fa-volume-down' }, { val: 'fa-volume-up' }, { val: 'fa-qrcode' }, { val: 'fa-barcode' }, { val: 'fa-tag' }, { val: 'fa-tags' }, { val: 'fa-book' }, { val: 'fa-bookmark' }, { val: 'fa-print' }, { val: 'fa-camera' }, { val: 'fa-font' }, { val: 'fa-bold' }, { val: 'fa-italic' }, { val: 'fa-text-height' }, { val: 'fa-text-width' }, { val: 'fa-align-left' }, { val: 'fa-align-center' }, { val: 'fa-align-right' }, { val: 'fa-align-justify' }, { val: 'fa-list' }, { val: 'fa-dedent' }, { val: 'fa-outdent' }, { val: 'fa-indent' }, { val: 'fa-video-camera' }, { val: 'fa-photo' }, { val: 'fa-image' }, { val: 'fa-picture-o' }, { val: 'fa-pencil' }, { val: 'fa-map-marker' }, { val: 'fa-adjust' }, { val: 'fa-tint' }, { val: 'fa-edit' }, { val: 'fa-pencil-square-o' }, { val: 'fa-share-square-o' }, { val: 'fa-check-square-o' }, { val: 'fa-arrows' }, { val: 'fa-step-backward' }, { val: 'fa-fast-backward' }, { val: 'fa-backward' }, { val: 'fa-play' }, { val: 'fa-pause' }, { val: 'fa-stop' }, { val: 'fa-forward' }, { val: 'fa-fast-forward' }, { val: 'fa-step-forward' }, { val: 'fa-eject' }, { val: 'fa-chevron-left' }, { val: 'fa-chevron-right' }, { val: 'fa-plus-circle' }, { val: 'fa-minus-circle' }, { val: 'fa-times-circle' }, { val: 'fa-check-circle' }, { val: 'fa-question-circle' }, { val: 'fa-info-circle' }, { val: 'fa-crosshairs' }, { val: 'fa-times-circle-o' }, { val: 'fa-check-circle-o' }, { val: 'fa-ban' }, { val: 'fa-arrow-left' }, { val: 'fa-arrow-right' }, { val: 'fa-arrow-up' }, { val: 'fa-arrow-down' }, { val: 'fa-mail-forward' }, { val: 'fa-share' }, { val: 'fa-expand' }, { val: 'fa-compress' }, { val: 'fa-plus' }, { val: 'fa-minus' }, { val: 'fa-asterisk' }, { val: 'fa-exclamation-circle' }, { val: 'fa-gift' }, { val: 'fa-leaf' }, { val: 'fa-fire' }, { val: 'fa-eye' }, { val: 'fa-eye-slash' }, { val: 'fa-warning' }, { val: 'fa-exclamation-triangle' }, { val: 'fa-plane' }, { val: 'fa-calendar' }, { val: 'fa-random' }, { val: 'fa-comment' }, { val: 'fa-magnet' }, { val: 'fa-chevron-up' }, { val: 'fa-chevron-down' }, { val: 'fa-retweet' }, { val: 'fa-shopping-cart' }, { val: 'fa-folder' }, { val: 'fa-folder-open' }, { val: 'fa-arrows-v' }, { val: 'fa-arrows-h' }, { val: 'fa-bar-chart-o' }, { val: 'fa-bar-chart' }, { val: 'fa-twitter-square' }, { val: 'fa-facebook-square' }, { val: 'fa-camera-retro' }, { val: 'fa-key' }, { val: 'fa-gears' }, { val: 'fa-cogs' }, { val: 'fa-comments' }, { val: 'fa-thumbs-o-up' }, { val: 'fa-thumbs-o-down' }, { val: 'fa-star-half' }, { val: 'fa-heart-o' }, { val: 'fa-sign-out' }, { val: 'fa-linkedin-square' }, { val: 'fa-thumb-tack' }, { val: 'fa-external-link' }, { val: 'fa-sign-in' }, { val: 'fa-trophy' }, { val: 'fa-github-square' }, { val: 'fa-upload' }, { val: 'fa-lemon-o' }, { val: 'fa-phone' }, { val: 'fa-square-o' }, { val: 'fa-bookmark-o' }, { val: 'fa-phone-square' }, { val: 'fa-twitter' }, { val: 'fa-facebook' }, { val: 'fa-github' }, { val: 'fa-unlock' }, { val: 'fa-credit-card' }, { val: 'fa-rss' }, { val: 'fa-hdd-o' }, { val: 'fa-bullhorn' }, { val: 'fa-bell' }, { val: 'fa-certificate' }, { val: 'fa-hand-o-right' }, { val: 'fa-hand-o-left' }, { val: 'fa-hand-o-up' }, { val: 'fa-hand-o-down' }, { val: 'fa-arrow-circle-left' }, { val: 'fa-arrow-circle-right' }, { val: 'fa-arrow-circle-up' }, { val: 'fa-arrow-circle-down' }, { val: 'fa-globe' }, { val: 'fa-wrench' }, { val: 'fa-tasks' }, { val: 'fa-filter' }, { val: 'fa-briefcase' }, { val: 'fa-arrows-alt' }, { val: 'fa-group' }, { val: 'fa-users' }, { val: 'fa-chain' }, { val: 'fa-link' }, { val: 'fa-cloud' }, { val: 'fa-flask' }, { val: 'fa-cut' }, { val: 'fa-scissors' }, { val: 'fa-copy' }, { val: 'fa-files-o' }, { val: 'fa-paperclip' }, { val: 'fa-save' }, { val: 'fa-floppy-o' }, { val: 'fa-square' }, { val: 'fa-navicon' }, { val: 'fa-reorder' }, { val: 'fa-bars' }, { val: 'fa-list-ul' }, { val: 'fa-list-ol' }, { val: 'fa-strikethrough' }, { val: 'fa-underline' }, { val: 'fa-table' }, { val: 'fa-magic' }, { val: 'fa-truck' }, { val: 'fa-pinterest' }, { val: 'fa-pinterest-square' }, { val: 'fa-google-plus-square' }, { val: 'fa-google-plus' }, { val: 'fa-money' }, { val: 'fa-caret-down' }, { val: 'fa-caret-up' }, { val: 'fa-caret-left' }, { val: 'fa-caret-right' }, { val: 'fa-columns' }, { val: 'fa-unsorted' }, { val: 'fa-sort' }, { val: 'fa-sort-down' }, { val: 'fa-sort-desc' }, { val: 'fa-sort-up' }, { val: 'fa-sort-asc' }, { val: 'fa-envelope' }, { val: 'fa-linkedin' }, { val: 'fa-rotate-left' }, { val: 'fa-undo' }, { val: 'fa-legal' }, { val: 'fa-gavel' }, { val: 'fa-dashboard' }, { val: 'fa-tachometer' }, { val: 'fa-comment-o' }, { val: 'fa-comments-o' }, { val: 'fa-flash' }, { val: 'fa-bolt' }, { val: 'fa-sitemap' }, { val: 'fa-umbrella' }, { val: 'fa-paste' }, { val: 'fa-clipboard' }, { val: 'fa-lightbulb-o' }, { val: 'fa-exchange' }, { val: 'fa-cloud-download' }, { val: 'fa-cloud-upload' }, { val: 'fa-user-md' }, { val: 'fa-stethoscope' }, { val: 'fa-suitcase' }, { val: 'fa-bell-o' }, { val: 'fa-coffee' }, { val: 'fa-cutlery' }, { val: 'fa-file-text-o' }, { val: 'fa-building-o' }, { val: 'fa-hospital-o' }, { val: 'fa-ambulance' }, { val: 'fa-medkit' }, { val: 'fa-fighter-jet' }, { val: 'fa-beer' }, { val: 'fa-h-square' }, { val: 'fa-plus-square' }, { val: 'fa-angle-double-left' }, { val: 'fa-angle-double-right' }, { val: 'fa-angle-double-up' }, { val: 'fa-angle-double-down' }, { val: 'fa-angle-left' }, { val: 'fa-angle-right' }, { val: 'fa-angle-up' }, { val: 'fa-angle-down' }, { val: 'fa-desktop' }, { val: 'fa-laptop' }, { val: 'fa-tablet' }, { val: 'fa-mobile-phone' }, { val: 'fa-mobile' }, { val: 'fa-circle-o' }, { val: 'fa-quote-left' }, { val: 'fa-quote-right' }, { val: 'fa-spinner' }, { val: 'fa-circle' }, { val: 'fa-mail-reply' }, { val: 'fa-reply' }, { val: 'fa-github-alt' }, { val: 'fa-folder-o' }, { val: 'fa-folder-open-o' }, { val: 'fa-smile-o' }, { val: 'fa-frown-o' }, { val: 'fa-meh-o' }, { val: 'fa-gamepad' }, { val: 'fa-keyboard-o' }, { val: 'fa-flag-o' }, { val: 'fa-flag-checkered' }, { val: 'fa-terminal' }, { val: 'fa-code' }, { val: 'fa-mail-reply-all' }, { val: 'fa-reply-all' }, { val: 'fa-star-half-empty' }, { val: 'fa-star-half-full' }, { val: 'fa-star-half-o' }, { val: 'fa-location-arrow' }, { val: 'fa-crop' }, { val: 'fa-code-fork' }, { val: 'fa-unlink' }, { val: 'fa-chain-broken' }, { val: 'fa-question' }, { val: 'fa-info' }, { val: 'fa-exclamation' }, { val: 'fa-superscript' }, { val: 'fa-subscript' }, { val: 'fa-eraser' }, { val: 'fa-puzzle-piece' }, { val: 'fa-microphone' }, { val: 'fa-microphone-slash' }, { val: 'fa-shield' }, { val: 'fa-calendar-o' }, { val: 'fa-fire-extinguisher' }, { val: 'fa-rocket' }, { val: 'fa-maxcdn' }, { val: 'fa-chevron-circle-left' }, { val: 'fa-chevron-circle-right' }, { val: 'fa-chevron-circle-up' }, { val: 'fa-chevron-circle-down' }, { val: 'fa-html5' }, { val: 'fa-css3' }, { val: 'fa-anchor' }, { val: 'fa-unlock-alt' }, { val: 'fa-bullseye' }, { val: 'fa-ellipsis-h' }, { val: 'fa-ellipsis-v' }, { val: 'fa-rss-square' }, { val: 'fa-play-circle' }, { val: 'fa-ticket' }, { val: 'fa-minus-square' }, { val: 'fa-minus-square-o' }, { val: 'fa-level-up' }, { val: 'fa-level-down' }, { val: 'fa-check-square' }, { val: 'fa-pencil-square' }, { val: 'fa-external-link-square' }, { val: 'fa-share-square' }, { val: 'fa-compass' }, { val: 'fa-toggle-down' }, { val: 'fa-caret-square-o-down' }, { val: 'fa-toggle-up' }, { val: 'fa-caret-square-o-up' }, { val: 'fa-toggle-right' }, { val: 'fa-caret-square-o-right' }, { val: 'fa-euro' }, { val: 'fa-eur' }, { val: 'fa-gbp' }, { val: 'fa-dollar' }, { val: 'fa-usd' }, { val: 'fa-rupee' }, { val: 'fa-inr' }, { val: 'fa-cny' }, { val: 'fa-rmb' }, { val: 'fa-yen' }, { val: 'fa-jpy' }, { val: 'fa-ruble' }, { val: 'fa-rouble' }, { val: 'fa-rub' }, { val: 'fa-won' }, { val: 'fa-krw' }, { val: 'fa-bitcoin' }, { val: 'fa-btc' }, { val: 'fa-file' }, { val: 'fa-file-text' }, { val: 'fa-sort-alpha-asc' }, { val: 'fa-sort-alpha-desc' }, { val: 'fa-sort-amount-asc' }, { val: 'fa-sort-amount-desc' }, { val: 'fa-sort-numeric-asc' }, { val: 'fa-sort-numeric-desc' }, { val: 'fa-thumbs-up' }, { val: 'fa-thumbs-down' }, { val: 'fa-youtube-square' }, { val: 'fa-youtube' }, { val: 'fa-xing' }, { val: 'fa-xing-square' }, { val: 'fa-youtube-play' }, { val: 'fa-dropbox' }, { val: 'fa-stack-overflow' }, { val: 'fa-instagram' }, { val: 'fa-flickr' }, { val: 'fa-adn' }, { val: 'fa-bitbucket' }, { val: 'fa-bitbucket-square' }, { val: 'fa-tumblr' }, { val: 'fa-tumblr-square' }, { val: 'fa-long-arrow-down' }, { val: 'fa-long-arrow-up' }, { val: 'fa-long-arrow-left' }, { val: 'fa-long-arrow-right' }, { val: 'fa-apple' }, { val: 'fa-windows' }, { val: 'fa-android' }, { val: 'fa-linux' }, { val: 'fa-dribbble' }, { val: 'fa-skype' }, { val: 'fa-foursquare' }, { val: 'fa-trello' }, { val: 'fa-female' }, { val: 'fa-male' }, { val: 'fa-gittip' }, { val: 'fa-sun-o' }, { val: 'fa-moon-o' }, { val: 'fa-archive' }, { val: 'fa-bug' }, { val: 'fa-vk' }, { val: 'fa-weibo' }, { val: 'fa-renren' }, { val: 'fa-pagelines' }, { val: 'fa-stack-exchange' }, { val: 'fa-arrow-circle-o-right' }, { val: 'fa-arrow-circle-o-left' }, { val: 'fa-toggle-left' }, { val: 'fa-caret-square-o-left' }, { val: 'fa-dot-circle-o' }, { val: 'fa-wheelchair' }, { val: 'fa-vimeo-square' }, { val: 'fa-turkish-lira' }, { val: 'fa-try' }, { val: 'fa-plus-square-o' }, { val: 'fa-space-shuttle' }, { val: 'fa-slack' }, { val: 'fa-envelope-square' }, { val: 'fa-wordpress' }, { val: 'fa-openid' }, { val: 'fa-institution' }, { val: 'fa-bank' }, { val: 'fa-university' }, { val: 'fa-mortar-board' }, { val: 'fa-graduation-cap' }, { val: 'fa-yahoo' }, { val: 'fa-google' }, { val: 'fa-reddit' }, { val: 'fa-reddit-square' }, { val: 'fa-stumbleupon-circle' }, { val: 'fa-stumbleupon' }, { val: 'fa-delicious' }, { val: 'fa-digg' }, { val: 'fa-pied-piper' }, { val: 'fa-pied-piper-alt' }, { val: 'fa-drupal' }, { val: 'fa-joomla' }, { val: 'fa-language' }, { val: 'fa-fax' }, { val: 'fa-building' }, { val: 'fa-child' }, { val: 'fa-paw' }, { val: 'fa-spoon' }, { val: 'fa-cube' }, { val: 'fa-cubes' }, { val: 'fa-behance' }, { val: 'fa-behance-square' }, { val: 'fa-steam' }, { val: 'fa-steam-square' }, { val: 'fa-recycle' }, { val: 'fa-automobile' }, { val: 'fa-car' }, { val: 'fa-cab' }, { val: 'fa-taxi' }, { val: 'fa-tree' }, { val: 'fa-spotify' }, { val: 'fa-deviantart' }, { val: 'fa-soundcloud' }, { val: 'fa-database' }, { val: 'fa-file-pdf-o' }, { val: 'fa-file-word-o' }, { val: 'fa-file-excel-o' }, { val: 'fa-file-powerpoint-o' }, { val: 'fa-file-photo-o' }, { val: 'fa-file-picture-o' }, { val: 'fa-file-image-o' }, { val: 'fa-file-zip-o' }, { val: 'fa-file-archive-o' }, { val: 'fa-file-sound-o' }, { val: 'fa-file-audio-o' }, { val: 'fa-file-movie-o' }, { val: 'fa-file-video-o' }, { val: 'fa-file-code-o' }, { val: 'fa-vine' }, { val: 'fa-codepen' }, { val: 'fa-jsfiddle' }, { val: 'fa-life-bouy' }, { val: 'fa-life-buoy' }, { val: 'fa-life-saver' }, { val: 'fa-support' }, { val: 'fa-life-ring' }, { val: 'fa-circle-o-notch' }, { val: 'fa-ra' }, { val: 'fa-rebel' }, { val: 'fa-ge' }, { val: 'fa-empire' }, { val: 'fa-git-square' }, { val: 'fa-git' }, { val: 'fa-hacker-news' }, { val: 'fa-tencent-weibo' }, { val: 'fa-qq' }, { val: 'fa-wechat' }, { val: 'fa-weixin' }, { val: 'fa-send' }, { val: 'fa-paper-plane' }, { val: 'fa-send-o' }, { val: 'fa-paper-plane-o' }, { val: 'fa-history' }, { val: 'fa-circle-thin' }, { val: 'fa-header' }, { val: 'fa-paragraph' }, { val: 'fa-sliders' }, { val: 'fa-share-alt' }, { val: 'fa-share-alt-square' }, { val: 'fa-bomb' }, { val: 'fa-soccer-ball-o' }, { val: 'fa-futbol-o' }, { val: 'fa-tty' }, { val: 'fa-binoculars' }, { val: 'fa-plug' }, { val: 'fa-slideshare' }, { val: 'fa-twitch' }, { val: 'fa-yelp' }, { val: 'fa-newspaper-o' }, { val: 'fa-wifi' }, { val: 'fa-calculator' }, { val: 'fa-paypal' }, { val: 'fa-google-wallet' }, { val: 'fa-cc-visa' }, { val: 'fa-cc-mastercard' }, { val: 'fa-cc-discover' }, { val: 'fa-cc-amex' }, { val: 'fa-cc-paypal' }, { val: 'fa-cc-stripe' }, { val: 'fa-bell-slash' }, { val: 'fa-bell-slash-o' }, { val: 'fa-trash' }, { val: 'fa-copyright' }, { val: 'fa-at' }, { val: 'fa-eyedropper' }, { val: 'fa-paint-brush' }, { val: 'fa-birthday-cake' }, { val: 'fa-area-chart' }, { val: 'fa-pie-chart' }, { val: 'fa-line-chart' }, { val: 'fa-lastfm' }, { val: 'fa-lastfm-square' }, { val: 'fa-toggle-off' }, { val: 'fa-toggle-on' }, { val: 'fa-bicycle' }, { val: 'fa-bus' }, { val: 'fa-ioxhost' }, { val: 'fa-angellist' }, { val: 'fa-cc' }, { val: 'fa-shekel' }, { val: 'fa-sheqel' }, { val: 'fa-ils' }, { val: 'fa-meanpath' }]
    }]);