window.addEventListener("DOMContentLoaded", function () {
   const searchPlace = document.getElementById('search-place')
   if (searchPlace) {
      searchPlace.addEventListener('click', (e) => {
         const input = e.target.querySelector('input')
         if (input) input.focus()
      })
   }

   const countPanels = document.querySelectorAll('.count-panel')
   if (countPanels.length) {
      countPanels.forEach(panel => {
         const sub = panel.querySelector('.count-panel__sub')
         const number = panel.querySelector('.count-panel__number')
         const add = panel.querySelector('.count-panel__add')
         const remained = number.parentElement.parentElement.querySelector('.panel-sales__remained')
         if (sub && number && add) {
            if (Number(number.innerHTML) === 1) sub.classList.add('none')
            sub.addEventListener('click', () => {
               if (Number(number.innerHTML) > 1) {
                  number.innerHTML = Number(number.innerHTML) - 1
                  if (remained) {
                     const remain = remained.innerHTML.split(' ')[1]
                     if (number.innerHTML < remain) {
                        add.classList.remove('none')
                     }
                  }
                  if (Number(number.innerHTML) !== 1) sub.classList.remove('none')
               }
               if (Number(number.innerHTML) === 1) sub.classList.add('none')
               checkPrice()
            })
            if (remained) {
               const remain = remained.innerHTML.split(' ')[1]
               if (number.innerHTML === remain) add.classList.add('none')
            }
            add.addEventListener('click', () => {
               if (remained) {
                  const remain = remained.innerHTML.split(' ')[1]
                  if (number.innerHTML < remain) {
                     number.innerHTML = Number(number.innerHTML) + 1
                  }
                  if (number.innerHTML === remain) add.classList.add('none')
               } else number.innerHTML = Number(number.innerHTML) + 1
               if (Number(number.innerHTML) !== 1) sub.classList.remove('none')
               checkPrice()
            })
         }
      })
   }

   function format(value) {
      return value.replace(new RegExp("^(\\d{" + (value.length % 3 ? value.length % 3 : 0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim()
   }

   const pricesFormat = document.querySelectorAll('.number-format')
   if (pricesFormat.length) {
      pricesFormat.forEach(price => {
         price.innerHTML = format(price.innerHTML);
         if (price.classList.contains('price-sales')) price.innerHTML += ' сом'
         if (price.classList.contains('sales')) price.innerHTML = '-' + price.innerHTML
      })
   }

   let mainSales = document.querySelectorAll('.main-sales')

   const buttonBlocks = document.querySelectorAll('.btns-panel__button')
   if (buttonBlocks.length) {
      buttonBlocks.forEach(button => {
         button.addEventListener('click', () => {
            if (button.classList.contains('love')) button.classList.toggle('active')
            if (button.classList.contains('delete') && button.parentElement.parentElement.parentElement && button.parentElement.parentElement.parentElement.classList.contains('main-sales__block')) {
               button.parentElement.parentElement.parentElement.remove()
               checkPrice()
               deleteCheck()
               mainSales = document.querySelectorAll('.main-sales')
               mainSales.forEach(sale => {
                  if (!sale.querySelectorAll('.main-sales__block').length && sale.parentElement) {
                     const parent = sale.parentElement
                     const check = parent.querySelector('.head-sales__checkbox')
                     const all = parent.querySelector('.head-sales__all')
                     const button = parent.querySelector('.head-sales__button')
                     if (check && button) {
                        if (sale.classList.contains('with-check') && all) {
                           check.classList.add('hide')
                           all.classList.remove('hide')
                        }
                        button.classList.add('hide')
                     }
                     if (parent.classList.contains('missing') && parent.querySelector('.sales-content__head')) {
                        parent.classList.add('no-margin')
                        parent.querySelector('.sales-content__head').classList.add('hide-line')
                     }
                  }
               })
               if (mainSales.length) {
                  mainSales.forEach(sales => {
                     const head = sales.previousElementSibling.querySelector('.custom-checkbox')
                     const check = sales.querySelectorAll('.custom-checkbox')
                     if (check.length) {
                        checkboxChange(head, check)
                        checkPrice()
                     }
                  })
               }
            }
         })
      })
   }

   function deleteCheck() {
      let mainBlock = document.querySelector('.content-main__sales.missing')
      if (mainBlock) {
         const title = mainBlock.querySelector('.head-sales__checkbox.title')
         const block = mainBlock.querySelector('.sales-content__main').querySelectorAll('.main-sales__block')
         if (title && block.length) {
            title.innerHTML = 'Отсутствуют · ' + block.length + ' товара'
         } else if (!block.length) {
            title.innerHTML = 'Отсутствуют · 0 товара'
         }
      }
   }

   const payCheck = document.querySelector('.pay-now')
   const payButton = document.querySelector('.change-offer__pay')

   deleteCheck()

   function checkboxChange(head, check) {
      let count = 0
      check.forEach(checkbox => {
         if (checkbox.checked) {
            count++
         }
      })
      if (count === check.length) head.checked = true
      else head.checked = false
   }

   if (mainSales.length) {
      mainSales.forEach(sales => {
         const head = sales.previousElementSibling.querySelector('.custom-checkbox')
         const check = sales.querySelectorAll('.custom-checkbox')
         if (check.length) {
            check.forEach(checkbox => {
               checkbox.addEventListener('change', () => {
                  checkboxChange(head, check)
                  checkPrice()
                  priceMain = document.querySelector('.block-price__value.main')
                  if (payCheck.checked) payButton.innerHTML = 'Оплатить ' + priceMain.innerHTML
               })
            })
         }
         if (head && check.length) {
            head.addEventListener('change', () => {
               if (head.checked) {
                  check.forEach(checkbox => {
                     checkbox.checked = true
                  })
               } else {
                  check.forEach(checkbox => {
                     checkbox.checked = false
                  })
               }
               checkPrice()
               priceMain = document.querySelector('.block-price__value.main')
               if (payCheck.checked) payButton.innerHTML = 'Оплатить ' + priceMain.innerHTML
            })
         }
      })
   }

   const popupLinks = document.querySelectorAll('.popup-link');
   const body = document.querySelector('body');
   const lockPadding = document.querySelectorAll('.lock-padding');
   let unlock = true;
   const timeout = 100;
   if (popupLinks.length > 0) {
      for (let index = 0; index < popupLinks.length; index++) {
         const popupLink = popupLinks[index];
         popupLink.addEventListener('click', function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
         });
      }
   }
   const popupCloseIcon = document.querySelectorAll('.close-popup');
   if (popupCloseIcon.length > 0) {
      for (let index = 0; index < popupCloseIcon.length; index++) {
         const el = popupCloseIcon[index];
         el.addEventListener('click', function (e) {
            popupClose(el.closest('.popup'));
            e.preventDefault();
         });
      }
   }

   function popupOpen(currentPopup) {
      if (currentPopup && unlock) {
         const popupActive = document.querySelector('.popup.open');
         if (popupActive) {
            popupClose(popupActive, false);
         } else {
            bodyLock();
         }
         currentPopup.classList.add('open');
         currentPopup.addEventListener('click', function (e) {
            if (!e.target.closest('.popup__content') && !e.target.parentElement.classList.contains('list-delivery__delete')) {
               popupClose(e.target.closest('.popup'));
            }
         });
      }
   }

   function popupClose(popupActive, doUnlock = true) {
      if (unlock) {
         if (popupActive) {
            popupActive.scrollTo(0, 0);
            popupActive.classList.remove('open');
         }
         if (doUnlock) {
            bodyUnlock();
         }
      }
   }

   function bodyLock() {
      const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
         }
      }
      body.style.paddingRight = lockPaddingValue;
      body.classList.add('lock');
      unlock = false;
      setTimeout(function () {
         unlock = true;
      }, timeout);
   }

   function bodyUnlock() {
      setTimeout(function () {
         if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
               const el = lockPadding[index];
               el.style.paddingRight = '0px';
            }
         }
         body.style.paddingRight = '0px';
         body.classList.remove('lock');
      }, timeout);
   }

   document.addEventListener('keydown', function (e) {
      if (e.keyCode === 27) {
         const popupActive = document.querySelector('.popup.open');
         if (popupActive) popupClose(popupActive);
      }
   });

   const buttonDelivery = document.querySelectorAll('.btns-delivery__button')
   const listDelivery = document.querySelectorAll('.main-delivery__list')
   if (buttonDelivery.length && listDelivery.length) {
      buttonDelivery.forEach(button => {
         const list = document.getElementById(button.dataset.id)
         if (list)
            button.addEventListener('click', () => {
               buttonDelivery.forEach(btn => btn.classList.remove('active'))
               listDelivery.forEach(list => list.classList.remove('active'))
               button.classList.add('active')
               list.classList.add('active')
            })
      })
   }

   function sizeFunc(sizes) {
      if (window.innerWidth < 992) {
         sizes.forEach(size => {
            if (size.parentElement.parentElement.parentElement && ![...size.parentElement.classList].includes('main-sales__block')) {
               size.innerHTML = size.innerHTML.split(' ')[1]
               size.parentElement.parentElement.parentElement.insertAdjacentElement("afterbegin", size)
            }
         })
      } else {
         sizes.forEach(size => {
            if (size.parentElement.querySelector('.info-sales__custom')) {
               size.innerHTML = size.innerHTML.includes('Размер: ') ? size.innerHTML : ('Размер: ' + size.innerHTML)
               size.parentElement.querySelector('.info-sales__custom').insertAdjacentElement("beforeend", size)
            }
         })
      }
   }

   const sizes = document.querySelectorAll('.custom-sales__block.size')
   if (sizes.length) {
      sizeFunc(sizes)
      window.addEventListener('resize', () => {
         sizeFunc(sizes)
      })
   }

   const navbarButtons = document.querySelectorAll('.navbar__button')
   if (navbarButtons.length) {
      navbarButtons.forEach(button => {
         button.addEventListener('click', () => {
            navbarButtons.forEach(btn => btn.classList.remove('active'))
            button.classList.add('active')
         })
      })
   }

   const infoButton = document.querySelectorAll('.hover-block')
   if (infoButton.length) {
      infoButton.forEach(button => {
         const blockActive = document.getElementById(button.dataset.id)
         if (blockActive) {
            button.addEventListener('mouseover', () => {
               if (!button.classList.contains('price-line') || window.innerWidth < 992) {
                  blockActive.style.top = '100%'
                  blockActive.style.left = '50%'
                  if (blockActive.getBoundingClientRect().right > (window.innerWidth - 20)) {
                     let count = -blockActive.getBoundingClientRect().width / 2 - (blockActive.getBoundingClientRect().right - window.innerWidth) - ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) ? 15 : 30)
                     blockActive.style.transform = 'translate(' + count + 'px, 7.5%)'
                  }
                  if (blockActive.getBoundingClientRect().left < 10) {
                     let count = -blockActive.getBoundingClientRect().width / 2 + Math.abs(blockActive.getBoundingClientRect().left) + 15
                     blockActive.style.transform = 'translate(' + count + 'px, 7.5%)'
                  }
               }
               if (button.classList.contains('price-line') && window.innerWidth >= 992) {
                  blockActive.style.top = '100%'
                  blockActive.style.left = '100%'
                  blockActive.style.transform = 'translate(-95%, 7.5%)'
               }
               blockActive.classList.add('active')
            })
            button.addEventListener('mouseleave', () => {
               blockActive.classList.remove('active')
               blockActive.style.transform = 'translate(-50%, 7.5%)'
            })
         }
      })
   }
   let priceMain = document.querySelector('.block-price__value.main')
   if (payCheck && payButton && priceMain) {
      payCheck.addEventListener('change', () => {
         priceMain = document.querySelector('.block-price__value.main')
         if (payCheck.checked) payButton.innerHTML = 'Оплатить ' + priceMain.innerHTML
         else payButton.innerHTML = 'Заказать'
      })
   }

   let salesBlock = document.querySelectorAll('.main-sales__block')
   const priceAll = document.querySelector('.block-price__value.all')
   const priceSales = document.querySelector('.block-price__value.sales')
   const allSalesInfo = document.querySelector('.head-sales__all')
   const bagInfo = document.querySelectorAll('.btns-header__block')
   const bagNavbar = document.querySelectorAll('.navbar__button')
   let deliveryCard = document.querySelectorAll('.info-value__card')
   let deliveryDate = document.querySelectorAll('.delivery-content__value.info-value-card')

   function checkPrice() {
      salesBlock = document.querySelectorAll('.main-sales__block')
      deliveryDate = document.querySelectorAll('.delivery-content__value.info-value-card')
      deliveryCard = document.querySelectorAll('.info-value__card')
      if (salesBlock.length && priceMain) {
         let priceMains = 0
         let priceMainsOnHead = 0
         let priceWithoutSales = 0
         let counts = 0
         salesBlock.forEach((block, index) => {
            const check = block.querySelector('.custom-checkbox')
            const price = block.querySelector('.price-sales__main')
            const priceAll = block.querySelector('.line-sales__text')
            const count = block.querySelector('.count-panel__number')
            if (check && check.checked && price && priceAll) {
               priceMains += Number(price.innerHTML.split(' ').join('').replace('сом', ''))
               priceWithoutSales += Number(priceAll.innerHTML.split(' ').join('').replace('сом', ''))
            }
            if (price) {
               priceMainsOnHead += Number(price.innerHTML.split(' ').join('').replace('сом', ''))
            }
            if (count) counts += Number(count.innerHTML)
            const card = deliveryCard[index]
            const img = block.querySelector('.block-sales__image').querySelector('img').src
            const countCard = count ? count.innerHTML : 0
            if (card) {
               const placeCount = card.querySelector('.place-value')
               const placeImage = card.querySelector('.card-value__image').querySelector('img')
               placeImage.src = img
               if (placeCount && countCard > 1) {
                  placeCount.innerHTML = countCard
                  placeCount.classList.add('card-value__count')
               }
               if (placeCount && countCard <= 1) {
                  placeCount.innerHTML = ''
                  placeCount.classList.remove('card-value__count')
               }
            }
         })
         if (salesBlock && priceAll && priceSales) {
            priceMain.innerHTML = format(priceMains.toString())
            if (priceMain.classList.contains('price-sales')) priceMain.innerHTML += ' сом'
            priceAll.innerHTML = format(priceWithoutSales.toString())
            if (priceAll.classList.contains('price-sales')) priceAll.innerHTML += ' сом'
            priceSales.innerHTML = format((priceWithoutSales - priceMains).toString())
            if (priceSales.classList.contains('price-sales')) priceSales.innerHTML += ' сом'
            if (priceSales.classList.contains('sales') && format((priceWithoutSales - priceMains).toString()) !== '0') priceSales.innerHTML = '-' + priceSales.innerHTML
         }
         if (allSalesInfo) {
            allSalesInfo.innerHTML = counts + ' товаров · ' + format(priceMainsOnHead.toString()) + ' сом'
         }
         if (bagInfo.length && bagNavbar.length) {
            bagInfo.forEach(bag => {
               if (bag.classList.contains('bag')) {
                  const text = bag.querySelector('span')
                  if (text) text.innerHTML = counts ? counts : ''
               }
            })
            bagNavbar.forEach(bag => {
               if (bag.classList.contains('bag')) {
                  const text = bag.querySelector('span')
                  if (text) text.innerHTML = counts ? counts : ''
               }
            })
         }
      }
   }

   function checkSize() {
      const priceBlock = document.querySelectorAll('.price-sales__main')
      priceBlock.forEach(price => {
         const parent = price.parentElement
         if (parent) {
            if (window.innerWidth >= 992) {
               ((parent.offsetWidth / price.offsetWidth + 0.26) * 100) > 150 ? price.style.fontSize = '20px' :
                  price.style.fontSize = `${(parent.offsetWidth / price.offsetWidth + 0.26) * 100}%`
            } else {
               price.style.fontSize = '16px'
            }
         }
      })
   }

   checkSize()
   window.addEventListener('resize', checkSize)
   checkPrice()

   function validateEmail(email) {
      let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      return re.test(String(email).toLowerCase());
   }

   function validatePhone(phone) {
      let regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
      return regex.test(phone);
   }

   function isNumeric(value) {
      return /^-?\d+$/.test(value);
   }

   function checkInput(block, input) {
      if (input && input.value !== '') {
         block.classList.remove('empty')
         block.classList.remove('error')
      }
      if (input && input.value === '') {
         block.classList.add('empty')
      }
      if ((input && input.name === 'phone' && input.value !== '' && !validatePhone(input.value.split(' ').join(''))) || (input && input.name === 'email' && input.value !== '' && !validateEmail(input.value.split(' ').join(''))) || (input && input.name === 'user-number' && input.value !== '' && (!isNumeric(input.value) || input.value.length !== 7))) {
         block.classList.remove('empty')
         block.classList.add('error')
      }
      if ((input && input.name === 'phone' && input.value !== '' && validatePhone(input.value.split(' ').join(''))) || (input && input.name === 'email' && input.value !== '' && validateEmail(input.value.split(' ').join(''))) || (input && input.name === 'user-number' && input.value !== '' && (isNumeric(input.value) && input.value.length === 7))) {
         block.classList.remove('empty')
         block.classList.remove('error')
      }
   }

   [].forEach.call(document.querySelectorAll('input[type="tel"]'), function (input) {
      let keyCode;

      function mask(event) {
         event.keyCode && (keyCode = event.keyCode);
         let pos = this.selectionStart;
         if (event.inputType === 'insertFromPaste') {
            let value = this.value.split('-').join('').split('(').join('').split(')').join('').split(' ').join('').slice(2, this.value.split('-').join('').split('(').join('').split(')').join('').split(' ').join('').length)
            if (value && value.length === 12) {
               this.value = value
            }
            if (value && value.length === 11) {
               this.value = '+' + value
            }
            if (value && value.length === 10) {
               this.value = '+7' + value
            }
            let valueTarget = this.value.split('(').join('').split(')').join('').split(' ').join('')
            this.value = valueTarget.slice(0, 2) + valueTarget.slice(2, 5) + valueTarget.slice(5, 8) + valueTarget.slice(8, 10) + valueTarget.slice(10, 12)
         } else {
            let valueTarget = this.value.split('(').join('').split(')').join('').split(' ').join('')
            this.value = valueTarget.slice(0, 2) + ' (' + valueTarget.slice(2, 5) + (valueTarget.slice(5, 8).length === 3 ? ') ' : '') + valueTarget.slice(5, 8) + (valueTarget.slice(8, 10).length === 0 ? '' : ' ') + valueTarget.slice(8, 10) + (valueTarget.slice(10, 12).length === 0 ? '' : ' ') + valueTarget.slice(10, 12)
         }
         if (pos < 3) event.preventDefault();
         let matrix = "+7 (___) ___ __ __",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function (a) {
               return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
         i = new_value.indexOf("_");
         if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
         }
         let reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function (a) {
               return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
         reg = new RegExp("^" + reg + "$");
         if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value.split('(').join('').split(')').join('');
         if (event.type == "blur" && this.value.length < 5) this.value = ""
         if (event.inputType === "deleteContentBackward") {
            this.value = new_value.split('(').join('').split(')').join('')
         }
         if (event.type == "blur" && new_value.split('(').join('').split(')').join('') !== '+7 ') {
            this.value = new_value.split('(').join('').split(')').join('')
         }
         if (event.type == "focus" || event.type == "input") {
            this.value = new_value.split('(').join('').split(')').join('')
         }
      }

      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false)
   });

   const blockInput = document.querySelectorAll('.user-change__block')
   if (blockInput.length && payButton) {
      payButton.addEventListener('click', () => {
         blockInput.forEach(block => {
            block.classList.remove('empty')
            block.classList.remove('error')
         })
         let errorBlock = 0
         blockInput.forEach(block => {
            const input = block.querySelector('input')
            if (input) {
               input.classList.add('process')
               checkInput(block, input)
            }
            if ((block.classList.contains('empty') || block.classList.contains('error')) && !errorBlock && window.innerWidth < 992) {
               errorBlock = block
            }
         })
         if (errorBlock) {
            errorBlock.scrollIntoView({
               behavior: 'smooth',
               block: 'start'
            });
         }
      })
      blockInput.forEach(block => {
         const input = block.querySelector('input')
         if (input) {
            input.addEventListener('blur', () => {
               checkInput(block, input)
               if (input && input.value === '') {
                  block.classList.remove('empty')
                  block.classList.remove('error')
               } else {
                  input.classList.add('process')
               }
            })
            input.addEventListener('input', () => {
               if (input && input.classList.contains('process')) {
                  checkInput(block, input)
                  if ((input && input.value === '') || (input.name === 'phone' && input.value === '+7 ')) {
                     block.classList.remove('empty')
                     block.classList.remove('error')
                  }
               }
            })
         }
      })
   }

   const deletePopup = document.querySelectorAll('.list-delivery__delete')
   if (deletePopup.length) {
      deletePopup.forEach(deleteButton => {
         deleteButton.addEventListener('click', () => {
            if (deleteButton.parentElement.parentElement.classList.contains('block__radio')) {
               deleteButton.parentElement.parentElement.remove()
            }
         })
      })
   }

   const buttonArrow = document.querySelectorAll('.buttons-open')
   if (buttonArrow.length) {
      buttonArrow.forEach(button => {
         const block = document.getElementById(button.dataset.id)
         if (block) {
            button.addEventListener('click', () => {
               button.classList.toggle('active')
               block.classList.toggle('hide')
               if (button.parentElement.classList.contains('line')) {
                  button.parentElement.classList.toggle('hide-line')
               }
               if (button.classList.contains('main-arrow')) {
                  if (button.parentElement) {
                     const checkbox = button.parentElement.querySelector('.head-sales__checkbox')
                     const all = button.parentElement.querySelector('.head-sales__all')
                     if (checkbox && all) {
                        checkbox.classList.toggle('hide')
                        all.classList.toggle('hide')
                        if (button.parentElement.parentElement) {
                           button.parentElement.parentElement.classList.toggle('no-margin')
                        }
                     }
                  }
               }
            })
         }
      })
   }

   const popupButtons = document.querySelectorAll('.main-content__button')
   if (popupButtons.length) {
      popupButtons.forEach(button => {
         button.addEventListener('click', () => {
            if (button.parentElement) {
               let check = button.parentElement.querySelector('input:checked').parentElement
               if (button.classList.contains('address')) {
                  const address1 = document.querySelector('.text-change__value.address')
                  const address2 = document.querySelector('.value-delivery__text')
                  const infoDelivery = address2.parentElement.querySelector('.value-delivery__info')
                  if (address1 && address2) {
                     const buttons = document.querySelectorAll('.btns-delivery__button')
                     let list = 0
                     const addressTitle1 = document.querySelector('.head-change__title.address')
                     const addressTitle2 = document.querySelector('.delivery-content__title.address')
                     buttons.length && buttons.forEach(button => {
                        if (addressTitle1 && addressTitle2 && infoDelivery && button.classList.contains('active') && button.classList.contains('get')) {
                           list = document.getElementById('list-1')
                           infoDelivery.classList.remove('hide')
                           addressTitle1.innerHTML = 'Доставка в пункт выдачи'
                           addressTitle2.innerHTML = 'Пункт выдачи'
                        }
                        if (addressTitle1 && addressTitle2 && infoDelivery && button.classList.contains('active') && button.classList.contains('curier')) {
                           list = document.getElementById('list-2')
                           infoDelivery.classList.add('hide')
                           addressTitle1.innerHTML = 'Доставка курьером'
                           addressTitle2.innerHTML = 'Курьером'
                        }
                     })
                     check = list.querySelector('input:checked').parentElement.querySelector('.block-content')
                     if (check) {
                        let text = check.querySelector('.block-content__text')
                        if (text) {
                           check = text
                        }
                        address1.innerHTML = address2.innerHTML = check.innerHTML
                     }
                  }
               }
               if (button.classList.contains('pay')) {
                  const pay1 = document.querySelector('.text-change__value.pay')
                  const pay2 = document.querySelector('.card-content__block')
                  if (pay1 && pay2) {
                     const payImage1 = pay1.querySelector('.card-image')
                     const payNumber1 = pay1.querySelector('.card-number')
                     const payImage2 = pay2.querySelector('.card-image')
                     const payNumber2 = pay2.querySelector('.card-number')
                     if (payImage1 && payNumber1 && payImage2 && payNumber2) {
                        const currentImage = check.querySelector('img')
                        const currentText = check.querySelector('.block-content')
                        if (currentImage && currentText) {
                           payImage1.src = payImage2.src = currentImage.src
                           payNumber1.innerHTML = payNumber2.innerHTML = currentText.innerHTML
                        }
                     }
                  }
               }
            }
         })
      })
   }
});