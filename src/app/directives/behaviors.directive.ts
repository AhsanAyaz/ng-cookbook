import { AfterViewInit, Directive } from '@angular/core';

declare var Gumshoe: any;
declare var Tobii: any;
declare var jarallax: any;

@Directive({
  selector: '[appBehaviors]',
  standalone: true,
})
export class BehaviorsDirective implements AfterViewInit {
  ngAfterViewInit() {
    window.addEventListener('load', fn, false);

    //  window.onload = function loader() {
    function fn() {
      // Preloader
      if (document.getElementById('preloader')) {
        setTimeout(() => {
          const preloader = document.getElementById('preloader');
          if (!preloader) {
            return;
          }
          preloader.style.visibility = 'hidden';
          preloader.style.opacity = '0';
        }, 350);
      }
      // Menus
      activateMenu();
    }

    //Menu
    /*********************/
    /* Toggle Menu */
    /*********************/
    function toggleMenu() {
      const toggleBtn = document.getElementById('isToggle');
      if (!toggleBtn) {
        return;
      }
      toggleBtn.classList.toggle('open');
      const isOpen = document.getElementById('navigation');
      if (!isOpen) {
        return;
      }
      if (isOpen.style.display === 'block') {
        isOpen.style.display = 'none';
      } else {
        isOpen.style.display = 'block';
      }
    }
    /*********************/
    /*    Menu Active    */
    /*********************/
    function getClosest(
      elem: Element | Document | ParentNode | null,
      selector: string
    ) {
      // Element.matches() polyfill

      // Get the closest matching element
      for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem instanceof Element && elem.matches(selector)) return elem;
      }
      return null;
    }

    function activateMenu() {
      const menuItems = document.getElementsByClassName(
        'sub-menu-item'
      ) as HTMLCollectionOf<HTMLAnchorElement>;
      if (menuItems) {
        var matchingMenuItem = null;
        for (var idx = 0; idx < menuItems.length; idx++) {
          if (menuItems[idx].href === window.location.href) {
            matchingMenuItem = menuItems[idx];
          }
        }

        if (matchingMenuItem) {
          matchingMenuItem.classList.add('active');

          var immediateParent = getClosest(matchingMenuItem, 'li');

          if (immediateParent) {
            immediateParent.classList.add('active');
          }

          var parent = getClosest(immediateParent, '.child-menu-item');
          if (parent) {
            parent.classList.add('active');
          }

          var parent = getClosest(
            parent || immediateParent,
            '.parent-menu-item'
          );

          if (parent) {
            parent.classList.add('active');

            var parentMenuitem = parent.querySelector('.menu-item');
            if (parentMenuitem) {
              parentMenuitem.classList.add('active');
            }

            var parentOfParent = getClosest(parent, '.parent-parent-menu-item');
            if (parentOfParent) {
              parentOfParent.classList.add('active');
            }
          } else {
            var parentOfParent = getClosest(
              matchingMenuItem,
              '.parent-parent-menu-item'
            );
            if (parentOfParent) {
              parentOfParent.classList.add('active');
            }
          }
        }
      }
    }
    /*********************/
    /*  Clickable manu   */
    /*********************/
    if (document.getElementById('navigation')) {
      const elements = document
        .getElementById('navigation')!
        .getElementsByTagName('a');
      for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = function (elem) {
          if (!elem.target) {
            return;
          }
          const target = elem.target as HTMLElement;
          if (target.getAttribute('href') === 'javascript:void(0)') {
            var submenu = target.nextElementSibling?.nextElementSibling;
            submenu?.classList.toggle('open');
          }
        };
      }
    }
    /*********************/
    /*   Menu Sticky     */
    /*********************/
    function windowScroll() {
      const navbar = document.getElementById('topnav');
      if (navbar != null) {
        if (
          document.body.scrollTop >= 50 ||
          document.documentElement.scrollTop >= 50
        ) {
          navbar.classList.add('nav-sticky');
        } else {
          navbar.classList.remove('nav-sticky');
        }
      }
    }

    window.addEventListener('scroll', (ev) => {
      ev.preventDefault();
      windowScroll();
    });
    /*********************/
    /*    Back To TOp    */
    /*********************/

    window.onscroll = function () {
      scrollFunction();
    };

    function scrollFunction() {
      var mybutton = document.getElementById('back-to-top');
      if (mybutton != null) {
        if (
          document.body.scrollTop > 500 ||
          document.documentElement.scrollTop > 500
        ) {
          mybutton.classList.add('block');
          mybutton.classList.remove('hidden');
        } else {
          mybutton.classList.add('hidden');
          mybutton.classList.remove('block');
        }
      }
    }

    //=========================================//
    /*/*            08) Tobii lightbox         */
    //=========================================//

    try {
      const tobii = new Tobii();
    } catch (err) {}

    //=========================================//
    /*/*            Top Function               */
    //=========================================//

    function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }

    const topBtn = document.getElementById('back-to-top');
    if (topBtn) {
      topBtn.addEventListener('click', topFunction);
    }

    /*********************/
    /*  Active Sidebar   */
    /*********************/
    (function () {
      var current = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
      );
      if (current === '') return;
      var menuItems = document.querySelectorAll('.sidebar-nav a');
      for (var i = 0, len = menuItems.length; i < len; i++) {
        if (menuItems[i].getAttribute('href')?.indexOf(current) !== -1) {
          menuItems[i].parentElement!.className += ' active';
        }
      }
    })();

    /**
     * Jarallax
     */

    if (jarallax) {
      jarallax(document.querySelectorAll('.jarallax'));
    }

    /*********************/
    /*   Feather Icons   */
    /*********************/
    // feather.replace();

    /*********************/
    /*     Small Menu    */
    /*********************/
    try {
      var spy = new Gumshoe('#navmenu-nav a');
    } catch (err) {}

    // /*********************/
    // /*      WoW Js       */
    // /*********************/
    // try {
    //   new WOW().init();
    // } catch (error) {}

    // /*************************/
    // /*      Contact Js       */
    // /*************************/

    // try {
    //   function validateForm() {
    //     var name = document.forms['myForm']['name'].value;
    //     var email = document.forms['myForm']['email'].value;
    //     var subject = document.forms['myForm']['subject'].value;
    //     var comments = document.forms['myForm']['comments'].value;
    //     document.getElementById('error-msg').style.opacity = 0;
    //     document.getElementById('error-msg').innerHTML = '';
    //     if (name == '' || name == null) {
    //       document.getElementById('error-msg').innerHTML =
    //         "<div class='alert alert-warning error_message'>*Please enter a Name*</div>";
    //       fadeIn();
    //       return false;
    //     }
    //     if (email == '' || email == null) {
    //       document.getElementById('error-msg').innerHTML =
    //         "<div class='alert alert-warning error_message'>*Please enter a Email*</div>";
    //       fadeIn();
    //       return false;
    //     }
    //     if (subject == '' || subject == null) {
    //       document.getElementById('error-msg').innerHTML =
    //         "<div class='alert alert-warning error_message'>*Please enter a Subject*</div>";
    //       fadeIn();
    //       return false;
    //     }
    //     if (comments == '' || comments == null) {
    //       document.getElementById('error-msg').innerHTML =
    //         "<div class='alert alert-warning error_message'>*Please enter a Comments*</div>";
    //       fadeIn();
    //       return false;
    //     }
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = function () {
    //       if (this.readyState == 4 && this.status == 200) {
    //         document.getElementById('simple-msg').innerHTML = this.responseText;
    //         document.forms['myForm']['name'].value = '';
    //         document.forms['myForm']['email'].value = '';
    //         document.forms['myForm']['subject'].value = '';
    //         document.forms['myForm']['comments'].value = '';
    //       }
    //     };
    //     xhttp.open('POST', 'php/contact.php', true);
    //     xhttp.setRequestHeader(
    //       'Content-type',
    //       'application/x-www-form-urlencoded'
    //     );
    //     xhttp.send(
    //       'name=' +
    //         name +
    //         '&email=' +
    //         email +
    //         '&subject=' +
    //         subject +
    //         '&comments=' +
    //         comments
    //     );
    //     return false;
    //   }

    //   function fadeIn() {
    //     var fade = document.getElementById('error-msg');
    //     var opacity = 0;
    //     var intervalID = setInterval(function () {
    //       if (opacity < 1) {
    //         opacity = opacity + 0.5;
    //         fade.style.opacity = opacity;
    //       } else {
    //         clearInterval(intervalID);
    //       }
    //     }, 200);
    //   }
    // } catch (error) {}

    /*********************/
    /* Dark & Light Mode */
    /*********************/
    try {
      function changeTheme(e: Event) {
        e.preventDefault();
        const htmlTag = document.getElementsByTagName('html')[0];

        if (htmlTag.className.includes('dark')) {
          htmlTag.className = 'light';
        } else {
          htmlTag.className = 'dark';
        }
      }

      const switcher = document.getElementById('theme-mode');
      switcher?.addEventListener('click', changeTheme);

      const chk = document.getElementById('chk');

      chk?.addEventListener('change', changeTheme);
      const htmlTag = document.getElementsByTagName('html')[0];
      htmlTag.className = 'dark';
    } catch (err) {}

    /*********************/
    /* LTR & RTL Mode */
    /*********************/
    try {
      const htmlTag = document.getElementsByTagName('html')[0];
      function changeLayout(e: Event) {
        e.preventDefault();
        const switcherRtl = document.getElementById('switchRtl');
        if (switcherRtl?.innerText === 'LTR') {
          htmlTag.dir = 'ltr';
        } else {
          htmlTag.dir = 'rtl';
        }
      }
      const switcherRtl = document.getElementById('switchRtl');
      switcherRtl?.addEventListener('click', changeLayout);
    } catch (err) {}
  }
}
