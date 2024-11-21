import { AfterViewInit, Directive, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appBehaviors]',
  standalone: true,
})
export class BehaviorsDirective implements AfterViewInit {
  document = inject(DOCUMENT);
  ngAfterViewInit() {
    this.document.addEventListener('load', fn, false);

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
    if (this.document.getElementById('navigation')) {
      const elements = this.document
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
    const windowScroll = () => {
      const navbar = this.document.getElementById('topnav');
      if (navbar != null) {
        if (
          this.document.body.scrollTop >= 50 ||
          this.document.documentElement.scrollTop >= 50
        ) {
          navbar.classList.add('nav-sticky');
        } else {
          navbar.classList.remove('nav-sticky');
        }
      }
    };

    this.document.addEventListener('scroll', (ev) => {
      ev.preventDefault();
      windowScroll();
    });
    /*********************/
    /*    Back To TOp    */
    /*********************/

    this.document.onscroll = () => {
      scrollFunction();
    };

    const scrollFunction = () => {
      var mybutton = this.document.getElementById('back-to-top');
      if (mybutton != null) {
        if (
          this.document.body.scrollTop > 500 ||
          this.document.documentElement.scrollTop > 500
        ) {
          mybutton.classList.add('block');
          mybutton.classList.remove('hidden');
        } else {
          mybutton.classList.add('hidden');
          mybutton.classList.remove('block');
        }
      }
    };

    //=========================================//
    /*/*            08) Tobii lightbox         */
    //=========================================//

    try {
      const tobii = new Tobii();
    } catch (err) {}

    //=========================================//
    /*/*            Top Function               */
    //=========================================//

    const topFunction = () => {
      this.document.body.scrollTop = 0;
      this.document.documentElement.scrollTop = 0;
    };

    const topBtn = this.document.getElementById('back-to-top');
    if (topBtn) {
      topBtn.addEventListener('click', topFunction);
    }

    /*********************/
    /*  Active Sidebar   */
    /*********************/
    (() => {
      const current = this.document.location.pathname.substring(
        this.document.location.pathname.lastIndexOf('/') + 1
      );
      if (current === '') return;
      const menuItems = this.document.querySelectorAll('.sidebar-nav a');
      for (let i = 0, len = menuItems.length; i < len; i++) {
        if (menuItems[i].getAttribute('href')?.indexOf(current) !== -1) {
          menuItems[i].parentElement!.className += ' active';
        }
      }
    })();

    /**
     * Jarallax
     */

    if ('jarallax' in globalThis) {
      jarallax(this.document.querySelectorAll('.jarallax'));
    }

    /*********************/
    /*   Feather Icons   */
    /*********************/
    // feather.replace();

    /*********************/
    /*     Small Menu    */
    /*********************/
    // try {
    //   const spy = new Gumshoe('#navmenu-nav a');
    // } catch (err) {}

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
      const changeTheme = (e: Event) => {
        e.preventDefault();
        const htmlTag = document.getElementsByTagName('html')[0];

        if (htmlTag.className.includes('dark')) {
          htmlTag.className = 'light';
        } else {
          htmlTag.className = 'dark';
        }
      };

      const switcher = this.document.getElementById('theme-mode');
      switcher?.addEventListener('click', changeTheme);

      const chk = this.document.getElementById('chk');

      chk?.addEventListener('change', changeTheme);
      const htmlTag = this.document.getElementsByTagName('html')[0];
      htmlTag.className = 'dark';
    } catch (err) {}

    /*********************/
    /* LTR & RTL Mode */
    /*********************/
    try {
      const htmlTag = this.document.getElementsByTagName('html')[0];
      const changeLayout = (e: Event) => {
        e.preventDefault();
        const switcherRtl = this.document.getElementById('switchRtl');
        if (switcherRtl?.innerText === 'LTR') {
          htmlTag.dir = 'ltr';
        } else {
          htmlTag.dir = 'rtl';
        }
      };
      const switcherRtl = this.document.getElementById('switchRtl');
      switcherRtl?.addEventListener('click', changeLayout);
    } catch (err) {}
  }
}
