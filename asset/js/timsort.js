const RUN = 16;
const ANIMATION_SPEED = 100
function getRandomPie() {
    const index = Math.floor(Math.random() * 17)
    return '0123456789abcdef'.split('')[index]
}

function getRandomColor() {
    return `#${getRandomPie()}${getRandomPie()}${getRandomPie()}`
}

const fullNodesRefs = document.querySelectorAll('.full-node')//not live



async function insertionSort(arr, left, right) {
    const insAfter = arr[left].previousElementSibling;
    const colorStr = getRandomColor()

    for (let i = left + 1; i <= right; i++) {
        const temp = arr[i];
        let j = i - 1;
        while (j >= left && Number.parseInt(arr[j].firstElementChild.innerText) > Number.parseInt(temp.firstElementChild.innerText)) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = temp;
    }

    //update the web ui for this chunk
    console.log(`ins : `);
    console.log(insAfter.firstElementChild.innerText);
    for (let i = right; i >= left; i--) {
        arr[i].firstElementChild.style.backgroundColor = colorStr
        await new Promise((res, rej) => {
            setTimeout(() => {
                insAfter.insertAdjacentElement('afterEnd', arr[i])
                // fullNodesRefs[fullNodesRefs.length - 1].insertAdjacentElement('beforeBegin', arr[i])
                res()
            }, ANIMATION_SPEED)
        })
    }
}

async function merge(arr, l, m, r) {
    const insAfter = arr[l].previousElementSibling;
    console.log(`merge : `);
    console.log(insAfter.firstElementChild.innerText);
    const len1 = m - l + 1
    const len2 = r - m;
    const left = new Array(len1)
    const right = new Array(len2)
    for (let i = 0; i < len1; i++)
        left[i] = arr[l + i];
    for (let i = 0; i < len2; i++)
        right[i] = arr[m + 1 + i];

    let i = 0;
    let j = 0;
    let k = l;

    while (i < len1 && j < len2) {
        if (Number.parseInt(left[i].firstElementChild.innerText) <= Number.parseInt(right[j].firstElementChild.innerText)) {
            arr[k] = left[i];
            i++;
        }
        else {
            arr[k] = right[j];
            j++;
        }
        k++;
    }

    while (i < len1) {
        arr[k] = left[i];
        k++;
        i++;
    }

    while (j < len2) {
        arr[k] = right[j];
        k++;
        j++;
    }

    //update the web ui for this chunk
    for (let i = r; i >= l; i--) {
        // arr[i].firstElementChild.style.backgroundColor = colorStr
        await new Promise((res, rej) => {
            setTimeout(() => {
                insAfter.insertAdjacentElement('afterEnd', arr[i])
                // fullNodesRefs[fullNodesRefs.length - 1].insertAdjacentElement('beforeBegin', arr[i])
                res()
            }, ANIMATION_SPEED)
        })
    }
}

export async function timSort(arr, n) {
    for (let i = 0; i < n; i += RUN)
        await insertionSort(arr, i, Math.min((i + RUN - 1), (n - 1)));
    for (let size = RUN; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min((left + 2 * size - 1), (n - 1));
            if (mid < right)
                await merge(arr, left, mid, right);
        }
    }
}

