import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  thumbnails: string[];
  specs?: { label: string; value: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 'smartvibe-pro',
      name: 'SmartVibe Pro Gold Edition',
      price: '450.000 Kz',
      category: 'SÉRIE GOLD',
      description: 'O SmartVibe Pro Gold Edition redefine a experiência wearable com um acabamento em ouro 18K e sensores de precisão médica. Desenvolvido para quem exige o máximo em estilo e funcionalidade.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz7XmJVn20H0CRhuWmX400i0Xow5TTS-L0-Q4qO_6flaxSjcim9XQnWSc7by2IzQSNYEUbwaYoR-LIFYdNVrCTYvRC8Zpe-mX3DVQMoX8fXkRCOMGAYJN9zzip0KjOwk7QYuUt2NSeDb9F0jVanYg7aWtAoYEEOApFTlVL22-ygbB9VrVx5Z9XggMC4TjT00mZDXzNxhAWSbW97gqeYtPtBu-INwz2eDuHNQpPuS9QdlvA7u1KEurKTzI3eGKPv7XvIUXg8sAKfSo',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDz7XmJVn20H0CRhuWmX400i0Xow5TTS-L0-Q4qO_6flaxSjcim9XQnWSc7by2IzQSNYEUbwaYoR-LIFYdNVrCTYvRC8Zpe-mX3DVQMoX8fXkRCOMGAYJN9zzip0KjOwk7QYuUt2NSeDb9F0jVanYg7aWtAoYEEOApFTlVL22-ygbB9VrVx5Z9XggMC4TjT00mZDXzNxhAWSbW97gqeYtPtBu-INwz2eDuHNQpPuS9QdlvA7u1KEurKTzI3eGKPv7XvIUXg8sAKfSo'
      ]
    },
    {
      id: 'acoustics-pure',
      name: 'Acoustics Pure Gold 3',
      price: '125.000 Kz',
      category: 'ÁUDIO PREMIUM',
      description: 'Som cristalino envolto em luxo. Os Acoustics Pure Gold 3 oferecem cancelamento de ruído ativo e uma fidelidade sonora sem precedentes, com detalhes em ouro escovado.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Jjdw7Ge_OGZ3CEkGUpu_dXnfC3maaVd3Q19DiejM0CzpaxI-hit_g59fe3qyY3-Yxht46xI2xkcgGiCXEabQxBQAJhcW7PW9MonqGcExi7nIp0QAIIlv-NrZYfIvifghuKPuP68pWe82arLoqt_mqHaPBHfLBLBOCCTxmoKBHYP6l5eRr-RD1DC9mN5RM52ItqdbcO7zHm5R_Mi4x9e1vGWFZxaXBH7BHVLuDEnIbH1STLxRfP7hYqptEAZqQASmHKo1a8A1u3E',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Jjdw7Ge_OGZ3CEkGUpu_dXnfC3maaVd3Q19DiejM0CzpaxI-hit_g59fe3qyY3-Yxht46xI2xkcgGiCXEabQxBQAJhcW7PW9MonqGcExi7nIp0QAIIlv-NrZYfIvifghuKPuP68pWe82arLoqt_mqHaPBHfLBLBOCCTxmoKBHYP6l5eRr-RD1DC9mN5RM52ItqdbcO7zHm5R_Mi4x9e1vGWFZxaXBH7BHVLuDEnIbH1STLxRfP7hYqptEAZqQASmHKo1a8A1u3E'
      ]
    },
    {
      id: 'novabook-air',
      name: 'NovaBook Air Titanium',
      price: '890.000 Kz',
      category: 'ULTRA-BOOK',
      description: 'O NovaBook Air Titanium combina a leveza do titânio com o poder de processamento de última geração. Uma ferramenta de trabalho indispensável para o profissional moderno.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBljm2Uj-dY4m-XsSKIlr_m1jdaGwz-pl9pfYy1tunk42mrcmYf9soSFeOmOLwKIrvnTRzuyR-nHmmldnznPvy8HaX4HlKVKyRTcvnPMmK9v61pBsP0yovnH86vTLrDte9HerkPzYT5f6gt19e_qg80KvxuPWtggFFdbRyR1_-Ek1kYpCloA5IWZMaLrDO6Kh3hf9BOk3q8U_zNjqeZ_LBqZUtYoxc3fGONh4Nmnq21cGa6D41yjFlVquOqvqmu_U6A1zyF1j4-cas',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBljm2Uj-dY4m-XsSKIlr_m1jdaGwz-pl9pfYy1tunk42mrcmYf9soSFeOmOLwKIrvnTRzuyR-nHmmldnznPvy8HaX4HlKVKyRTcvnPMmK9v61pBsP0yovnH86vTLrDte9HerkPzYT5f6gt19e_qg80KvxuPWtggFFdbRyR1_-Ek1kYpCloA5IWZMaLrDO6Kh3hf9BOk3q8U_zNjqeZ_LBqZUtYoxc3fGONh4Nmnq21cGa6D41yjFlVquOqvqmu_U6A1zyF1j4-cas'
      ]
    },
    {
      id: 'chronos-gold',
      name: 'Chronos Gold Smart',
      price: '195.000 Kz',
      category: 'WEARABLES',
      description: 'Elegância clássica encontra tecnologia de ponta. O Chronos Gold Smart é mais do que um relógio, é um assistente pessoal de luxo no seu pulso.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9OHAJRw7EYV21lhU9i7QKUn1sGKY-6jDRUn9FwRUHryAnGTlL9VGHnI7qmQXD19OSYfJltmsOmEymIXdXYsFlNYefhR4bRFnUyekTnabRtCrK0SL9g2CFb8NSs2XHuw8Fock0NO5AGhmfxbVQO29KwDan7q4Z988H5RWD4y4cGfDdtJbMKDvMGY0WTbABek3aWgGTt_6pKLAPaIU2dluY4NBop0tmMH78GB5CyBg937iWUJPrvjruVNJNLsyhrPKaI4zpExv0m3Y',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB9OHAJRw7EYV21lhU9i7QKUn1sGKY-6jDRUn9FwRUHryAnGTlL9VGHnI7qmQXD19OSYfJltmsOmEymIXdXYsFlNYefhR4bRFnUyekTnabRtCrK0SL9g2CFb8NSs2XHuw8Fock0NO5AGhmfxbVQO29KwDan7q4Z988H5RWD4y4cGfDdtJbMKDvMGY0WTbABek3aWgGTt_6pKLAPaIU2dluY4NBop0tmMH78GB5CyBg937iWUJPrvjruVNJNLsyhrPKaI4zpExv0m3Y'
      ]
    },
    {
      id: 'lensmaster-gold',
      name: 'LensMaster X-Gold 50mm',
      price: '320.000 Kz',
      category: 'FOTOGRAFIA',
      description: 'Capture a beleza com precisão absoluta. A lente LensMaster X-Gold oferece uma abertura excepcional e nitidez de borda a borda para os fotógrafos mais exigentes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnjhZWz6Ro0WKYFHb8h9yuMa80oxV5rhs7mp3LrcFx1KbMPElbLOw9G0rG8s2zON1tFdjCc73v2ZhowhWDCZV7DaEU_5X9gil_3iWmm3z3iEJX1NR-kpHh52VRyWJKyk_q3yHPyou4MuyD4PkQ5gwSaXeZ1hXnrYVDnymYIdlgh4LnzxN1ldL9PXwEG-0S50F7EeqxKmu8xDTfcr2okpK8eH_HrlnRmqytVHEhswoIuh0lzlH2iI-XvrM7blMjXkaczlDywSjPccM',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCnjhZWz6Ro0WKYFHb8h9yuMa80oxV5rhs7mp3LrcFx1KbMPElbLOw9G0rG8s2zON1tFdjCc73v2ZhowhWDCZV7DaEU_5X9gil_3iWmm3z3iEJX1NR-kpHh52VRyWJKyk_q3yHPyou4MuyD4PkQ5gwSaXeZ1hXnrYVDnymYIdlgh4LnzxN1ldL9PXwEG-0S50F7EeqxKmu8xDTfcr2okpK8eH_HrlnRmqytVHEhswoIuh0lzlH2iI-XvrM7blMjXkaczlDywSjPccM'
      ]
    },
    {
      id: 'sonicpods-gold',
      name: 'SonicPods Gold-Noise',
      price: '85.000 Kz',
      category: 'ÁUDIO',
      description: 'Pequenos no tamanho, gigantes no som. Os SonicPods Gold-Noise trazem a assinatura sonora da Ondjila para o seu dia a dia com total liberdade sem fios.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3YhfJGKQ1jbeRM6jlQFvtl4p5z79bt2QbbrZ2Is2uMLJ9qF2yTkZdDV7o572dlnn4uhSCpR56B0nSKfoFOsQJ5kWo1Jit4H1nH5KT6610aC1EbLQsA8o5eVdGjj1t7lstwUUTNT9SiwDog418ThS5UDadG84aQXeerswB5hQ5j9-tvFL0d78CAv2S0tmoOLkHa0TqzNqtkUxueZvyRSykqp0ydMIG0ftj_wBZWgcptrc4N3pgM8DlKL8QscwWGWnirRggS0i6Y4U',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC3YhfJGKQ1jbeRM6jlQFvtl4p5z79bt2QbbrZ2Is2uMLJ9qF2yTkZdDV7o572dlnn4uhSCpR56B0nSKfoFOsQJ5kWo1Jit4H1nH5KT6610aC1EbLQsA8o5eVdGjj1t7lstwUUTNT9SiwDog418ThS5UDadG84aQXeerswB5hQ5j9-tvFL0d78CAv2S0tmoOLkHa0TqzNqtkUxueZvyRSykqp0ydMIG0ftj_wBZWgcptrc4N3pgM8DlKL8QscwWGWnirRggS0i6Y4U'
      ]
    },
    {
      id: 'anel-heranca',
      name: 'Anel Herança Angolana em Ouro 18K',
      price: '125.500,00 Kz',
      category: 'JOALHARIA',
      description: 'Este anel de ouro 18K é uma celebração da arte tradicional angolana. Com padrões intrincados inspirados nos têxteis e cerâmicas ancestrais do planalto central, cada peça é fundida à mão pelos nossos mestres artesãos em Luanda.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxjnsZZQLgKa8wwn68v5t0fzN9RoCtahrd31U1Y7OOZj2x2UbNN5jIx_xtgDjoMqr_rS-8pgajpNT1gNwCflPtcHHXfWUWZeuPmtibtExLlP0iZx3N8b7eMej1hrjxd2whjO1FCNrqJIWMtbaXYYFqvNs6GRqkRq3zsLIIeuSX-wz5dRCLU7NOTs1h4BBYpYMfLOohDSAHjlfd8JwdIdv_ezWoFRMprrPHWrpgjgf0kLpQaFkDZ8DKavaOUZX_GAsbiyxV5kV6j4w',
      thumbnails: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArEqi7AdVoFKJA1VRmRs3cROx3_JvR8jKDbQPSzB4UjW7aFWDnPdwdECfeN1MP8KKGH8hZTGXqy4SWOICNsoriGUIGeNmzb0P-92XT9DDueQVv_Ej0Wze0zCt-jou3y8iX787IGiEDK9FoN-G0Po7trncjHdvRz7Qs6KpPyNI4kZBDQKcvI2avXOraH6rvXl8TANCjEQpV4wkFWDPJwJCOih9hHck3KMli9wrWlhRza0oNdawugl9MhTH-dX5Mf61CP3H1jdtFIN8'
      ]
    },
    {
      id: 'sony-wh',
      name: 'Sony WH-1000XM5',
      price: '285.000 Kz',
      category: 'ÁUDIO',
      description: 'O melhor cancelamento de ruído do mundo agora com um design ainda mais elegante e confortável.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH0YtF06qXq90P1v6B0S6K7m9f8z7x5c4v3b2n1m0q9w8e7r6t5y4u3i2o1p0a9s8d7f6g5h4j3k2l1zxcvbnm',
      thumbnails: []
    },
    {
      id: 'macbook-pro',
      name: 'MacBook Pro 14',
      price: '1.250.000 Kz',
      category: 'COMPUTADORES',
      description: 'Potência bruta para profissionais. O novo MacBook Pro com chip M2 Pro oferece desempenho sem compromissos.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_EKhjq0JPfx-t41-7iTs-8QxJEgTzb-aGEA7tpljn-s96J_1UVIk93DbVUdO3VvVGhZlYCtNSV6qvWCKHBugpJrzoKbvwL6ENENBLTGgQKoUR4OAGj0O9uE_fbTfrR7oOu3OQcxXapF-ata3kVf6bckDTcqmhIQ1h45YkPgn19f_W5O89HkTcxqaLt13oUyYxdRIwRgt83yhz6tJoY9WMBccXiBSNX4pKUTKusA-mEZWUdeDn24gb3x2Cf0oJ9V_HSk5i7pD3ne4',
      thumbnails: []
    },
    {
      id: 'ipad-pro',
      name: 'iPad Pro 12.9',
      price: '850.000 Kz',
      category: 'TABLETS',
      description: 'O iPad definitivo. Com ecrã Liquid Retina XDR e o poder do chip M2.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7dg8yvFEewoxEtdFaWr4ekY_Qq5LCNJvTvrHwZiBU9jgXLeN2JjCzDCaFF9AK-L-kHQTqI3t6mVxEEnfzkUKpWTUOrBYXjzBVxHk4zdnZXlOSA17mleYp_gkTStwKSUnGGerKTBFEcqeNehH7Ef4CidXXbxpyVG7QI5pUm_UtKAd7XlRQAXTxQ6NbIqBYmHW2h7SNAC7qO6wn5FZ0Q6i65yE7SIDu76rjUyUAiL6_cUsyGy5p3dsqSiD3Cc8LqpRX-YDGbNma8c8',
      thumbnails: []
    },
    {
      id: 'steelseries',
      name: 'SteelSeries Arctis',
      price: '27.500 Kz',
      category: 'GAMING',
      description: 'Conforto e qualidade sonora superior para as suas sessões de gaming mais intensas.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABqvj6gSDnk3P3B_dZAM097bJdB-t1ep9MaknV9nAqTK3MC5u43wE8j9h1yEi1ZWYsVYoCaHHoQEk78O2GdgKxE3kvSTCeT-7OtyZOD6HyKr0yNaiusufYMVokiFOXTEvCtpAyzBuA4nTGAU2c6dobC8ry_nhmqF4T8mdUt1YPHOMb854gygbkuL1YE6LlgYsqq1300xrcMzz6AR15O71zCgsk-pl5_VIB_u5D3JA981RikNvPFWwZ4gRr829jrW8UwbguTdSYLaA',
      thumbnails: []
    },
    {
      id: 'bose-qc',
      name: 'Bose QuietComfort',
      price: '45.990,00 Kz',
      category: 'ÁUDIO',
      description: 'O padrão ouro em cancelamento de ruído. Conforto lendário e som de alta fidelidade.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXbTuD3WWsyEnTsieBaUQjgqcpokqPAicHkz_xMPIBh9NEtT7IRQsSPvRqClQoQ4TMnm4l22d12mVKPNHTIbtZv65pKXvZ5JhmtCK_EuPo1y3yPxfpszs5RsDZgLHpXnFEI6zxQgDnRhC9N_k5r-pmiLJDA0Sn4rnLDse7Da9NUOyNCExlIzPC5DH7w0u5JBjuc4pkEnXAjEXc1L8kNePXND7E6eR4cHYLqbkfRBKh2FmlFDBBsLKF-xHVzmlkTFjTUbz0ZIMwG58',
      thumbnails: []
    },
    {
      id: 'airpods-pro',
      name: 'AirPods Pro',
      price: '38.500,00 Kz',
      category: 'ÁUDIO',
      description: 'Magia nos seus ouvidos. Cancelamento de ruído ativo e áudio espacial para uma imersão total.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPJz3d4Wx7hLp5cl1vSCBzBfsVsxMVMUsXBYyicPYMzLczYjyX99U36fL6YBrgrViH-SNK63u5rJMkD0urX9FJwqpEh2HDK3I_EHPBevIeFseZcZ13yT_2uD1FjOWV4UaTBG3iDARJWc48RvYnd1MY3cZhlLjKGCIN19Vw94dqeiB6CvEULrXpTFN4RB62pB33ys3VFVZZzqnTSM0zVO_OXqIn9vrZCw5Qv6zz4FLNA3EOQu78J_z9YwT3Biupd6p7VUer5xXRqZo',
      thumbnails: []
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }
}
