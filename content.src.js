import { createClient } from '@supabase/supabase-js'

const SUPABASE_PUBLIC_KEY = "sb_publishable_xFloLGUj-lFUruqI0tdZjA_HixNodJ3"
const SUPABASE_URL = "https://menkgxgkrwllvolymuxf.supabase.co"

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const existingElement = document.querySelector(selector);
        if (existingElement) {
            return resolve(existingElement);
        }
        const timer = setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout: Element "${selector}" not found within ${timeout}ms`));
        }, timeout);
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearTimeout(timer);
                observer.disconnect();
                resolve(element);
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function logItem(name, quantity) {
    const { data, error } = await supabase
        .from('foods')
        .insert({ name: name, amt: quantity })

    if (error) console.error('Supabase insert failed:', error)
    else console.log('Logged:', data)
}

async function checkLastBought(name) {
    const { data, error } = await supabase
        .from('foods')
        .select('created_at, amt')
        .eq('name', name)
        .order('created_at', { ascending: false })
        .limit(1)

    if (error) {
        console.error('Supabase lookup failed:', error)
        return
    }

    if (data.length > 0) {
        const lastDate = new Date(data[0].created_at)
        const amount = data[0].amt;
        const daysAgo = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysAgo === 0) {
            console.log(`You already bought "${name}" today`)
        } else if (daysAgo === 1) {
            console.log(`You last bought "${name}" 1 day ago`)
        } else {
            console.log(`You last bought "${name}" ${daysAgo} days ago`)
        }

        Popup = document.createElement("div")
        document.body.appendChild(Popup)
        var popupHTML =  '<div class="tmf-popup">' +
'        <style>' +
'            .tmf-popup {' +
'                width: 50%;' +
'                height: 55%;' +
'                display: flex;' +
'                left: 50%;' +
'                top: 50%;' +
'                transform: translate(-50%, -50%);' +
'                position: fixed;' +
'                background-color: #f79a68;' +
'                border-radius: 1rem;' +
'                flex-direction: column;' +
'                z-index: 9999;' +
'            }' +
'            .tmf-title {' +
'                width: 100%;' +
'                text-align: center;' +
'                height: 10%;' +
'            }' +
'            .tmf-body {' +
'                width: 100%;' +
'                text-align: center;' +
'                font-size: 2em;' +
'            }' +
'            .tmf-dismiss {' +
'                background-color: #ff5f0960;' +
'                border-radius: 1rem;' +
'                height: 27%;' +
'                border: none;' +
'                margin: 5px;' +
'                font-size: 2em;' +
'            }' +
'        </style>' +
'        <h1 class="tmf-title">Info ℹ️</h1>' +
`        <p class="tmf-body">You bought ${String(amount)}x ${name} ${String(daysAgo)} day(s) ago!</p>` +
'        <button class="tmf-dismiss" onclick="document.querySelector(\'.tmf-popup\').remove()">Ok</button>' +
'    </div>';
    Popup.innerHTML = popupHTML;

    } else {
        console.log(`You've never bought "${name}" before`)
    }
}

function getProductNameFromButton(button) {
    const label = button.getAttribute('aria-label') || ''
    const match = label.match(/^Add (.+) to trolley$/)
    return match ? match[1] : null
}

function PageUpdate(){
    setTimeout(function(){
        let BuyBtns = document.querySelectorAll('[data-testid="add-button"]');
        BuyBtns.forEach(function(thingy){
            thingy.addEventListener("click", event=>{
                console.log("KACHING!!!")

                const name = getProductNameFromButton(thingy)
                if (name) {
                    checkLastBought(name)
                } else {
                    console.warn('Could not parse product name from aria-label:', thingy.getAttribute('aria-label'))
                }
            })
        })
    }, 3000)
    if (location.href == "https://www.sainsburys.co.uk/gol-ui/checkout/summary") {
        console.log("Time to waste your money :D")
        waitForElement('.trolley-item__item', 7000)
            .then(element => {
                setTimeout(function(){
                    document.querySelectorAll(".trolley-item__item").forEach(function(item){
                        if (item.dataset.tmfLogged) return
                        item.dataset.tmfLogged = "true"

                        const unmodifyiable = item.querySelector(".trolley-item__unmodifiable_info");
                        const wrapper = unmodifyiable.querySelector(".trolley-item__tile-checkout");
                        const wrapper2 = unmodifyiable.querySelector('[data-testid="dietary-warning-wrapper"]')
                        const product = wrapper.querySelector(".trolley-item__product");

                        let name = product.querySelector(".trolley-item__product-title").innerHTML;
                        let quantity = wrapper2.querySelector("p").innerHTML;
                        quantity = quantity.split(" ")[1]

                        console.log(name, quantity)
                        logItem(name, quantity)
                    })
                }, 200)
            })
            .catch(err => console.error(err.message));
    }
}

window.onload = function() {
    PageUpdate();
}

let lastHref = location.href;
setInterval(() => {
    if (location.href !== lastHref) {
        lastHref = location.href;
        PageUpdate();
    }
}, 500);