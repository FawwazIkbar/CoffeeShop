document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Robusta", img: "1.jpg", price: 25000 },
      { id: 2, name: "Gayo", img: "2.jpg", price: 30000 },
      { id: 3, name: "Arabica", img: "3.jpg", price: 35000 },
      { id: 4, name: "Sumatra", img: "4.jpg", price: 40000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    totalHarga: 0,
    totalBarang: 0,
    add(newItem) {
      // cek barang yang sama di cary
      const cartItem = this.items.find((item) => item.id === newItem.id);
      // jika barang masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, totalBarang: 1, totalHarga: newItem.price });
        this.totalBarang++; //menghitung total barang keseluruhan item
        this.totalHarga += newItem.price;
      } else {
        // jika barang sudah ada,
        this.items = this.items.map((item) => {
          if (item.id !== newItem.id) {
            return item;
          } else {
            //  cek barang beda atau sama di cart
            item.totalBarang++; //menghitung total barang satuan item
            item.totalHarga = item.price * item.totalBarang;

            this.totalBarang++;
            this.totalHarga += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);

      //jika item lebih dari 1
      if (cartItem.totalBarang > 1) {
        this.items = this.items.map((item) => {
          // jika bukan barang yg diklik

          if (item.id !== id) {
            return item;
          } else {
            item.totalBarang--;
            item.totalHarga = item.price * item.totalBarang;
            this.totalBarang--;
            this.totalHarga -= item.price;
            return item;
          }
        });
      } else if (cartItem.totalBarang === 1) {
        this.items = this.items.filter((item) => item.id !== id);
        this.totalBarang--;
        this.totalHarga -= cartItem.price;
      }
    },
  });
});

// form validasi
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

/* kirim data ketika cheouut button di klik */
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form); //ambil form data dari form
  const data = new URLSearchParams(formData); //ambil data dari URL
  const objData = Object.fromEntries(data); //ubah data ke objek
  const message = formatMessage(objData);
  // masukkan nomor hp owner
  window.open(`http://wa.me/6282173398603?text=` + encodeURIComponent(message));
});

// format wa
const formatMessage = (obj) => {
  return `Data Customer
  Nama  : ${obj.name}
  Email : ${obj.email}
  Phone : ${obj.phone}

  Data Pesanan : 
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.totalBarang} X ${rupiah(item.totalHarga)})`)}

  TOTAL Harga : ${rupiah(obj.totalHarga)}
  TERIMAKASIH:)
  `;
};

// konversi ke rupiah

const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
