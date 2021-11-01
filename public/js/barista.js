
//Barista Complete/Delete Functions
document.querySelector('#trash').addEventListener('click', deleteCompItems)
const completeButtons = document.querySelectorAll('.completeButton')
if (completeButtons.length > 0)
    completeButtons.forEach(completeButton => completeButton.addEventListener('click', markComplete));

function markComplete(click) {
    // console.log(click.currentTarget.id);
    fetch('orders', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'id': click.currentTarget.id
        })
    }).then(function () {
        // window.speechSynthesis.speak(new SpeechSynthesisisUtterance(" Order for " + res.value.customer + "is" + "red" + "dee"));
        window.location.reload()
    })
}


function deleteCompItems() {
    // console.log('Wiped');
    fetch('ordersComplete', {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(window.location.reload(''))
}
