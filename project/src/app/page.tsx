"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import ThemeSwitch from "@/components/ThemeSwitch";
import AppleLogo from "@/assets/apple.svg";
import { IoFilter } from "react-icons/io5";
import { TbBuildingSkyscraper } from "react-icons/tb";

interface Address {
	address: string;
	city: string;
	state: string;
	postalCode: string;
}

interface Company {
	name: string;
	department: string;
	title: string;
	address: Address;
}

interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: Address;
	company: Company;
}

export default function HomePage() {
	const [users, setUsers] = useState<User[]>([]);
	const [search, setSearch] = useState("");
	const [expanded, setExpanded] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("https://dummyjson.com/users?limit=100")
			.then((res) => res.json())
			.then((data) => {
				setUsers(data.users);
			})
			.finally(() => setLoading(false));
	}, []);

	const filtered = users.filter((user) =>
		`${user.firstName} ${user.lastName}`
			.toLowerCase()
			.includes(search.toLowerCase())
	);

	const toggleExpand = (id: number) => {
		setExpanded(expanded === id ? null : id);
	};

	return (
		<main className={styles.container}>
			<div className={styles.dash}>
				<div className={styles.header}>
					<AppleLogo className={styles.logo} />
					<h1 className={styles.title}>Użytkownicy</h1>
					<ThemeSwitch />
				</div>

				<div className={styles.info}>
					<p>Lista użytkowników korzystających z naszych urządzeń</p>
				</div>

				<div className={styles.filters}>
					<span className={styles.found}>
						Znaleziono: {loading ? "..." : filtered.length}
					</span>
					<div className={styles.group}>
						<input
							type="text"
							placeholder=" "
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className={styles.search}
						/>
						<label className={styles.searchLabel}>
							<svg
								width="20px"
								height="20px"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M17.545 15.467l-3.779-3.779a6.15 6.15 0 0 0 .898-3.21c0-3.417-2.961-6.377-6.378-6.377A6.185 6.185 0 0 0 2.1 8.287c0 3.416 2.961 6.377 6.377 6.377a6.15 6.15 0 0 0 3.115-.844l3.799 3.801a.953.953 0 0 0 1.346 0l.943-.943c.371-.371.236-.84-.135-1.211zM4.004 8.287a4.282 4.282 0 0 1 4.282-4.283c2.366 0 4.474 2.107 4.474 4.474a4.284 4.284 0 0 1-4.283 4.283c-2.366-.001-4.473-2.109-4.473-4.474z" />
							</svg>
							<span>Wyszukaj</span>
						</label>
					</div>
					<button>
						<IoFilter />
					</button>
				</div>

				<ul className={styles.list}>
					{loading
						? // 🔹 Skeletony
						  Array.from({ length: 8 }).map((_, i) => (
								<li key={i} className={`${styles.card} ${styles.skeletonCard}`}>
									<div className={styles.skeletonHeader}>
										<div className={styles.skeletonTitle}></div>
									</div>
									<div className={styles.skeletonLines}>
										<div></div>
									</div>
								</li>
						  ))
						: // 🔹 Użytkownicy
						  filtered.map((user) => (
								<li
									key={user.id}
									className={`${styles.card} ${
										expanded === user.id ? styles.expanded : ""
									}`}
									onClick={() => toggleExpand(user.id)}
								>
									<div className={styles.cardHeader}>
										<h3>
											{user.firstName} {user.lastName}
										</h3>
										<p>
											<TbBuildingSkyscraper />
											{user.company.name}
										</p>
									</div>

									{expanded === user.id && (
										<div className={styles.details}>
											<p>
												<strong>Telefon:</strong> {user.phone}
											</p>
											<p>
												<strong>Email:</strong> {user.email}
											</p>
											<p>
												<strong>Firma:</strong> {user.company.name}
											</p>
											<p>
												<strong>Stanowisko:</strong> {user.company.title}
											</p>
											<p>
												<strong>Dział:</strong> {user.company.department}
											</p>
											<p>
												<strong>Adres firmy:</strong>{" "}
												{user.company.address.address},{" "}
												{user.company.address.city},{" "}
												{user.company.address.state}{" "}
												{user.company.address.postalCode}
											</p>
											<p>
												<strong>Adres domowy:</strong> {user.address.address},{" "}
												{user.address.city}, {user.address.state}{" "}
												{user.address.postalCode}
											</p>
										</div>
									)}
								</li>
						  ))}
				</ul>
			</div>
		</main>
	);
}
