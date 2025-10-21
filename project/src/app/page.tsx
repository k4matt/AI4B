"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import ThemeSwitch from "@/components/ThemeSwitch";
import AppleLogo from "@/assets/apple.svg";
import { IoBan, IoFilter } from "react-icons/io5";
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
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [showFilters, setShowFilters] = useState(false);
	const [selectedStates, setSelectedStates] = useState<string[]>([]);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const [isMobile, setIsMobile] = useState(false);

	const itemsPerPage = 20;

	useEffect(() => {
		fetch("https://dummyjson.com/users?limit=100")
			.then((res) => res.json())
			.then((data) => setUsers(data.users))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 1060);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (selectedUser && isMobile) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [selectedUser, isMobile]);

	const allStates = Array.from(new Set(users.map((u) => u.address.state))).sort();

	const filtered = users.filter((user) => {
		const matchesSearch = `${user.firstName} ${user.lastName}`
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesState =
			selectedStates.length === 0 || selectedStates.includes(user.address.state);
		return matchesSearch && matchesState;
	});

	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const openUser = (user: User) => setSelectedUser(user);
	const closeUser = () => setSelectedUser(null);
	const goToPage = (page: number) => setCurrentPage(page);

	const toggleState = (state: string) => {
		setSelectedStates((prev) =>
			prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
		);
		setCurrentPage(1);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setShowFilters(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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
					<div className={styles.group}>
						<input
							type="text"
							id="search"
							placeholder=" "
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								goToPage(1);
							}}
							className={styles.search}
						/>
						<label className={styles.searchLabel} htmlFor="search">
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

					<div className={styles.filterGroup}>
						<div className={styles.dropdownWrapper} ref={dropdownRef}>
							<button
								className={`${styles.filterButton} ${
									showFilters ? styles.activeFilterBtn : ""
								}`}
								onClick={() => setShowFilters((prev) => !prev)}
								title="Filtruj według stanu"
							>
								<IoFilter />
							</button>
							{showFilters && (
								<div className={styles.filterDropdown}>
									<h4>Filtruj według stanu:</h4>
									<div className={styles.filterList}>
										{allStates.map((state) => (
											<label key={state} className={styles.filterItem}>
												<input
													type="checkbox"
													checked={selectedStates.includes(state)}
													onChange={() => toggleState(state)}
												/>
												<span>{state}</span>
											</label>
										))}
									</div>
								</div>
							)}
						</div>
						<div className={styles.offWrapper}>
							<button
								className={`${styles.clearFilterButton}`}
								onClick={() => {
									setSearch("");
									setSelectedStates([]);
									setShowFilters(false);
									setCurrentPage(1);
								}}
								title="Wyczyść filtry"
							>
								<IoBan />
							</button>
						</div>
					</div>

					<div className={styles.foundWrapper}>
						<IoFilter className={styles.foundIcon} />
						<span className={styles.found}>
							Znaleziono: {loading ? "..." : filtered.length}
						</span>
					</div>
				</div>

				<div
					className={`${styles.viewWrapper} ${
						selectedUser ? styles.showDetails : ""
					}`}
				>
					<ul className={styles.list}>
						{loading
							? Array.from({ length: 8 }).map((_, i) => (
									<li key={i} className={`${styles.card} ${styles.skeletonCard}`}>
										<div className={styles.skeletonHeader}>
											<div className={styles.skeletonTitle}></div>
										</div>
										<div className={styles.skeletonLines}>
											<div></div>
										</div>
									</li>
							  ))
							: paginated.map((user) => (
									<li
										key={user.id}
										className={styles.card}
										onClick={() => openUser(user)}
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
									</li>
							  ))}
					</ul>

					<div className={styles.pagination}>
						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i + 1}
								onClick={() => goToPage(i + 1)}
								className={currentPage === i + 1 ? styles.activePage : ""}
							>
								{i + 1}
							</button>
						))}
					</div>

					{selectedUser && isMobile && (
						<div className={styles.overlay} onClick={closeUser} aria-hidden="true" />
					)}

					<div className={styles.userDetails}>
						{selectedUser ? (
							<>
								<button className={styles.backBtn} onClick={closeUser}>
									← Ukryj
								</button>
								<h2 className={styles.userName}>
									{selectedUser.firstName} {selectedUser.lastName}
								</h2>
								<div className={styles.userSegments}>
									<section className={styles.segment}>
										<h3 className={styles.segmentTitle}>Dane osobiste</h3>
										<div className={styles.userInfo}>
											<p>
												<span className={styles.label}>Telefon:</span>{" "}
												{selectedUser.phone}
											</p>
											<p>
												<span className={styles.label}>Email:</span>{" "}
												{selectedUser.email}
											</p>
											<p>
												<span className={styles.label}>Adres domowy:</span>{" "}
												{selectedUser.address.address},{" "}
												{selectedUser.address.city},{" "}
												{selectedUser.address.state}{" "}
												{selectedUser.address.postalCode}
											</p>
										</div>
									</section>
									<section className={styles.segment}>
										<h3 className={styles.segmentTitle}>Dane firmowe</h3>
										<div className={styles.userInfo}>
											<p>
												<span className={styles.label}>Firma:</span>{" "}
												{selectedUser.company.name}
											</p>
											<p>
												<span className={styles.label}>Stanowisko:</span>{" "}
												{selectedUser.company.title}
											</p>
											<p>
												<span className={styles.label}>Dział:</span>{" "}
												{selectedUser.company.department}
											</p>
											<p>
												<span className={styles.label}>Adres firmy:</span>{" "}
												{selectedUser.company.address.address},{" "}
												{selectedUser.company.address.city},{" "}
												{selectedUser.company.address.state}{" "}
												{selectedUser.company.address.postalCode}
											</p>
										</div>
									</section>
								</div>
							</>
						) : (
							<p style={{ color: "var(--text-muted)" }}></p>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}